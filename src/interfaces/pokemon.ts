import { EnergyType } from "..";

export interface Pokemon {
  readonly id: string;
  readonly name: string;
  readonly hp: number;
  readonly type: string;
  readonly damageCounters?: number;
  readonly energy?: EnergyType[];
  readonly stage: 'Basic' | 'Stage 1' | 'Stage 2';
}
