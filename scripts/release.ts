import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import semver, { type ReleaseType } from 'semver';

const [, , bumpArg, preArg] = process.argv;

if (!bumpArg) {
  console.error('Usage: pnpm release -- <patch|minor|major> [prerelease]');
  process.exit(1);
}

const preLabels = ['alpha', 'beta', 'rc'] as const;
const stableBumps = ['patch', 'minor', 'major'] as const;

type Pre = (typeof preLabels)[number];
type Bump = (typeof stableBumps)[number];

const isPre = (arg?: string): arg is Pre =>
  !!arg && preLabels.includes(arg as Pre);
const isBump = (arg?: string): arg is Bump =>
  !!arg && stableBumps.includes(arg as Bump);

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
const current = pkg.version as string;
const parsed = semver.parse(current);
if (!parsed) {
  console.error(`Invalid version: ${current}`);
  process.exit(1);
}

let newVersion: string | null = null;

if (isPre(bumpArg)) {
  if (preArg) {
    console.error('Cannot provide two prerelease identifiers.');
    process.exit(1);
  }

  const bumpBase = parsed.prerelease.length ? 'prerelease' : 'prepatch';

  newVersion = semver.inc(current, bumpBase, bumpArg);
} else if (isBump(bumpArg)) {
  if (!preArg) newVersion = semver.inc(current, bumpArg);
  else if (isPre(preArg)) {
    if (bumpArg === 'patch')
      console.warn(
        `Warning: patch ${preArg} is discouraged. Use "${preArg}" alone. Proceeding anyway...`,
      );
    newVersion = semver.inc(current, `pre${bumpArg}` as ReleaseType, preArg);
  } else {
    console.error(`Invalid prerelease identifier: ${preArg}`);
    process.exit(1);
  }
} else {
  console.error(`Invalid bump type: ${bumpArg}`);
  process.exit(1);
}

if (!newVersion) {
  console.error('Failed to calculate new version.');
  process.exit(1);
}

const gitCommand = `git commit -S --allow-empty -m "chore: release v${newVersion}" -m "Release-As: ${newVersion}"`;

execSync(gitCommand, { stdio: 'inherit' });
execSync('git push', { stdio: 'inherit' });

console.log(`Release Triggered: ${current} → ${newVersion}`);
console.log(`Run this command manually if needed:`);
console.log(gitCommand);
