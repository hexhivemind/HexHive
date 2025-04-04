import { type Type, Project } from 'ts-morph';
import path from 'path';
import fs from 'fs';
import { defineNuxtModule } from '@nuxt/kit';

// Shared generator function.
async function generateRuntimeTypes(rootDir: string) {
  const baseDir = path.resolve(rootDir, 'types');
  // Types to generate runtime objects for, from types folder. Extensions optional
  const typeFiles = ['listing'];

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

  const extractUnionLiterals = (type: Type): string[] =>
    type.getUnionTypes().map((t) => t.getLiteralValue() as string);

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

      if (name === 'SpriteVariant') {
        runtimeTypes[name] = processSpriteVariantType(type);
      } else if (isLiteralUnion(type)) {
        runtimeTypes[name] = extractUnionLiterals(type);
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
          'SpritesData',
          'SoundData',
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
  fs.writeFileSync(outputPath, output);
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
