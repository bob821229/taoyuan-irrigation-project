import { WaterNeedsCalculator } from "@/utils/WaterNeedsCalculator";

export function cloneJson(value) {
    return JSON.parse(JSON.stringify(value));
}

export async function runWaterNeedsSimulation(settings, baseDataFilterCallback = null) {
    const calculator = new WaterNeedsCalculator();
    const calculationSettings = {
        ...settings,
        baseDataFilterCallback,
    };

    await calculator.calculate(calculationSettings);

    return {
        calculator,
        prefix: calculator.prefix,
        baseData: await calculator.getBaseData(),
        outcomes: await calculator.getOutcomes(),
        reservoirWaterStoarage: await calculator.getReservoirWaterStoarage(),
        areaWaterNeedsByIrrigationGroup:
            await calculator.getAreaWaterNeedsByIrrigationGroup(),
    };
}

export function applySimulationResult(target, result) {
    target.baseData = result.baseData;
    target.outcomes = result.outcomes;
    target.reservoirWaterStoarage = result.reservoirWaterStoarage;
    target.areaWaterNeedsByIrrigationGroup =
        result.areaWaterNeedsByIrrigationGroup;
}

export function buildStepCompareSettings(userSettings, baseDataFilterCallback) {
    return {
        ...cloneJson(userSettings.step1),
        baseDataPath: userSettings.step2.baseDataPath,
        fieldWaterNeedPercentage: userSettings.step2.fieldWaterNeedPercentage,
        irrigationOrganizationTendaysWaterUsage:
            userSettings.irrigationOrganizationTendaysWaterUsage,
        reservoirGivingTendaysWater: userSettings.reservoirGivingTendaysWater,
        baseDataFilterCallback,
    };
}
