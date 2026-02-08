export enum DurationUnit {
  S = 'S',
  MS = 'MS',
  M = 'M',
  H = 'H',
}

interface Duration {
  unit: DurationUnit
  value: number
}

const durationMap: Record<DurationUnit, Duration> = {
  MS: {
    unit: DurationUnit.MS,
    value: 1,
  },
  S: {
    unit: DurationUnit.MS,
    value: 1_000,
  },
  M: {
    unit: DurationUnit.MS,
    value: 60_000,
  },
  H: {
    unit: DurationUnit.MS,
    value: 3_600_000,
  },
}

export class DurationInstance {
  public unit: DurationUnit
  public value: number

  constructor(unit: DurationUnit, value: number) {
    this.unit = unit
    this.value = value
  }

  public getBaseValue(): number {
    const valueMultiplier: number = durationMap[this.unit].value

    return this.value * valueMultiplier
  }

  public toMilliseconds(): DurationInstance {
    if (this.unit === DurationUnit.MS) {
      return this
    }

    this.value = this.getBaseValue()
    this.unit = DurationUnit.MS

    return this
  }

  public format(): string {
    switch (this.unit) {
      case DurationUnit.MS:
        return `${this.value} milliseconds`

      case DurationUnit.S:
        return `${this.value} seconds`

      case DurationUnit.M:
        return `${this.value} minutes`

      case DurationUnit.H:
        return `${this.value} hours`

      default:
        return `${this.value}`
    }
  }
}
