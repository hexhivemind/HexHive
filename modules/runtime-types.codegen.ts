import {
  type StringLiteral,
  type TypeNode,
  type LiteralTypeNode,
  type Type,
  Project,
  SyntaxKind,
} from 'ts-morph';

import path from 'path';
import fs from 'fs';
import { defineNuxtModule } from '@nuxt/kit';
import { format, resolveConfig } from 'prettier';

// Shared generator function.
async function generateRuntimeTypes(rootDir: string) {
  const baseDir = path.resolve(rootDir, 'types');
  // Types to generate runtime objects for, from types folder. Extensions optional
  const typeFiles = ['listing', 'types'];

  const delcarationFiles = typeFiles.map((name) => {
    const fileName = name.endsWith('.d.ts') ? name : `${name}.d.ts`;
    return path.resolve(__dirname, baseDir, fileName);
  });

  const project = new Project({
    tsConfigFilePath: path.resolve(rootDir, 'tsconfig.json'),
  });

  const runtimeTypes: Record<string, unknown> = {};

  const isLiteralUnion = (type: Type): boolean =>
    type.isUnion() && type.getUnionTypes().every((t) => t.isStringLiteral());

  const isExtractableLiteralUnionNode = (node: TypeNode): boolean =>
    node.getKind() === SyntaxKind.UnionType &&
    node
      .asKindOrThrow(SyntaxKind.UnionType)
      .getTypeNodes()
      .some(
        (n) =>
          n.getKind() === SyntaxKind.LiteralType &&
          (n as LiteralTypeNode).getLiteral().getKind() ===
            SyntaxKind.StringLiteral,
      );

  const extractUnionLiterals = (type: Type): string[] =>
    type.getUnionTypes().map((t) => t.getLiteralValue() as string);

  const extractStringLiteralsFromNode = (node: TypeNode): string[] =>
    node
      .asKindOrThrow(SyntaxKind.UnionType)
      .getTypeNodes()
      .filter(
        (n) =>
          n.getKind() === SyntaxKind.LiteralType &&
          (n as LiteralTypeNode).getLiteral().getKind() ===
            SyntaxKind.StringLiteral,
      )
      .map((n) =>
        ((n as LiteralTypeNode).getLiteral() as StringLiteral).getLiteralText(),
      );

  const extractVariantType = (type: Type) => {
    if (type.isUndefined()) return undefined;
    if (type.isString()) return 'string';
    if (type.isStringLiteral()) return type.getLiteralValue();
    if (isLiteralUnion(type)) return extractUnionLiterals(type);
    else if (type.isUnion()) return 'mixedUnion';
    if (type.isObject()) return '[object]';
    return 'unknown';
  };

  const processSpriteVariantType = (type: Type): unknown => {
    const props: Record<string, unknown> = {};
    type.getProperties().forEach((tProp) => {
      const propType = tProp.getTypeAtLocation(tProp.getDeclarations()[0]);
      const subtype: Record<string, unknown> = {};
      propType.getProperties().forEach((subProp) => {
        const subType = subProp.getTypeAtLocation(subProp.getDeclarations()[0]);
        const variantProp = subType.getProperty('variant');
        if (variantProp) {
          const variantType = variantProp.getTypeAtLocation(
            variantProp.getDeclarations()[0],
          );
          subtype[subProp.getName()] = {
            variant: extractVariantType(variantType),
          };
        }
      });
      props[tProp.getName()] = subtype;
    });
    return props;
  };

  delcarationFiles.forEach((filePath) => {
    const sourceFile = project.getSourceFileOrThrow(filePath);

    sourceFile.getTypeAliases().forEach((alias) => {
      const name = alias.getName();
      const type = alias.getType();
      const typeNode = alias.getTypeNodeOrThrow();

      if (name === 'SpriteVariant') {
        runtimeTypes[name] = processSpriteVariantType(type);
      } else if (isLiteralUnion(type)) {
        runtimeTypes[name] = extractUnionLiterals(type);
        // } else if (isExtractableLiteralUnion(type)) {
        //   runtimeTypes[name] = extractExtractableUnionLiterals(type);
      } else if (isExtractableLiteralUnionNode(typeNode)) {
        runtimeTypes[name] = extractStringLiteralsFromNode(typeNode);
      }
    });

    sourceFile.getInterfaces().forEach((intf) => {
      const name = intf.getName();

      // Skip these known complex models
      if (
        [
          'ListingData',
          'RomhackData',
          'AssetHive',
          'SpriteData',
          'SoundData',
          'ScriptData',
        ].includes(name)
      )
        return;

      const variantProp = intf.getProperty('variant');
      if (variantProp) {
        const type = variantProp.getType();
        runtimeTypes[name] = { variant: extractVariantType(type) };
      }
    });
  });

  const output = `// AUTO-GENERATED FILE — DO NOT EDIT
                  // Generated from: ${typeFiles.join(', ')}
                  export const runtimeTypes = ${JSON.stringify(runtimeTypes, null, 2)} as const
                  `;

  const outputPath = path.resolve(
    __dirname,
    '../types/runtimeTypes.generated.ts',
  );

  const config = await resolveConfig(outputPath);
  const formattedOutput = await format(output, {
    ...config,
    parser: 'typescript',
  });

  fs.writeFileSync(outputPath, formattedOutput);
  // eslint-disable-next-line no-console
  console.log(`[runtime-types-codegen] Generated: ${outputPath}`);
}

export default defineNuxtModule({
  meta: {
    name: 'runtime-types-codegen',
    configKey: 'runtimeTypesCodgen',
  },
  setup(_options, nuxt) {
    const callGenerator = () => generateRuntimeTypes(nuxt.options.rootDir);

    // nuxt.hook('ready', callGenerator);
    nuxt.hook('prepare:types', callGenerator);
    // nuxt.hook('build:before', callGenerator);
    // nuxt.hook('listen', callGenerator);
    // nuxt.hook('builder:generateApp', callGenerator);
    // nuxt.hook('preview:before', callGenerator);
  },
});
