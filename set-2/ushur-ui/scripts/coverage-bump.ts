import fs from "fs";
import path from "path";
import yargs from "yargs";

if (process.env.CI) {
  // eslint-disable-next-line no-console
  console.log(
    "Skipping attempt to bump code coverage threshold in CI/CD environment"
  );
  process.exit();
}

interface CoverageInfo {
  lines: string;
  statements: string;
  branches: string;
  functions: string;
}

const hasCoverageIncreased = (
  actualCoverage: CoverageInfo,
  coverageThreshold: CoverageInfo
) => {
  if (
    actualCoverage.lines > coverageThreshold.lines ||
    actualCoverage.statements > coverageThreshold.statements ||
    actualCoverage.branches > coverageThreshold.branches ||
    actualCoverage.functions > coverageThreshold.functions
  ) {
    return true;
  }

  return false;
};

const reportThresholdBump = (
  actualCoverage: CoverageInfo,
  coverageThreshold: CoverageInfo,
  updatedFile: string
) => {
  const goodJob = "Good job! You increased code coverage.";
  // eslint-disable-next-line max-len
  const msg = `${goodJob}. The code coverage threshold file ${updatedFile} has been updated for you. Please commit this file and try again.`;
  // eslint-disable-next-line no-console
  console.error(msg);
  // eslint-disable-next-line no-console
  console.error("Current code coverage thresholds");
  // eslint-disable-next-line no-console
  console.error(`  ${JSON.stringify(coverageThreshold, null, 4)}`);
  // eslint-disable-next-line no-console
  console.error("\nNew code coverage");
  // eslint-disable-next-line no-console
  console.error(`  ${JSON.stringify(actualCoverage, null, 4)}`);

  // process.exit(1);
};

const getCoverageInfo = (srcJson: Record<string, string>): CoverageInfo => {
  const { lines } = srcJson;
  const { statements } = srcJson;
  const { branches } = srcJson;
  const { functions } = srcJson;

  return {
    lines,
    statements,
    branches,
    functions,
  };
};

const getCoverageInfoSummary = (
  srcJson: Record<
    string,
    {
      pct: string;
    }
  >
): CoverageInfo => {
  const lines = srcJson.lines.pct;
  const statements = srcJson.statements.pct;
  const branches = srcJson.branches.pct;
  const functions = srcJson.functions.pct;

  return {
    lines,
    statements,
    branches,
    functions,
  };
};

const TEST_TYPES = ["component", "bdd", "e2e"];

const { argv } = yargs(process.argv.slice(2)).option("type", {
  choices: TEST_TYPES,
  demandOption: true,
});

const argumentType = (argv as Record<string, string>).type;

if (argumentType === "component") {
  const packageJsonPath = path.join(__dirname, "..", "package.json");
  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf8")
  ) as Record<string, Record<string, Record<string, Record<string, string>>>>;

  // Only supporting the canvas feature at this point
  const coverageThresholdConfig =
    packageJson.jest.coverageThreshold["src/features/canvas"];
  const coverageSummaryThresholdInfo = getCoverageInfo(coverageThresholdConfig);

  const coverageSummaryPath = path.join(
    __dirname,
    "..",
    "coverage",
    "coverage-summary.json"
  );
  const coverageSummary = JSON.parse(
    fs.readFileSync(coverageSummaryPath, "utf8")
  ) as Record<string, Record<string, { pct: string }>>;
  const coverageSummaryInfo = getCoverageInfoSummary(coverageSummary.total);

  if (hasCoverageIncreased(coverageSummaryInfo, coverageSummaryThresholdInfo)) {
    reportThresholdBump(
      coverageSummaryInfo,
      coverageSummaryThresholdInfo,
      "package.json"
    );
    packageJson.jest.coverageThreshold["src/features/canvas"] = {
      ...coverageSummaryInfo,
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
} else if (argumentType === "bdd" || argumentType === "e2e") {
  const configFile =
    argumentType === "bdd" ? ".nycrc.bdd.json" : ".nycrc.e2e.json";

  const configPath = path.join(__dirname, "..", configFile);
  let configContent = JSON.parse(fs.readFileSync(configPath, "utf8")) as Record<
    string,
    string
  >;
  const coverageSummaryThresholdInfo = getCoverageInfo(configContent);

  const coverageSummaryPath = path.join(
    __dirname,
    "..",
    "coverage",
    argumentType,
    "coverage-summary.json"
  );
  const coverageSummary = JSON.parse(
    fs.readFileSync(coverageSummaryPath, "utf8")
  ) as Record<string, Record<string, { pct: string }>>;

  const coverageSummaryInfo = getCoverageInfoSummary(coverageSummary.total);

  if (hasCoverageIncreased(coverageSummaryInfo, coverageSummaryThresholdInfo)) {
    reportThresholdBump(
      coverageSummaryInfo,
      coverageSummaryThresholdInfo,
      configFile
    );
    configContent = {
      ...configContent,
      ...coverageSummaryInfo,
    };
    fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2));
  }
}
