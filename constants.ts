import { MetalDefinition } from './types';
import { CopperIcon, GoldIcon, SilverIcon, AluminumIcon } from './components/icons/MetalIcons';

export const METAL_DEFINITIONS: MetalDefinition[] = [
    { key: 'COPPER_WIRE', name: 'مس مفتول ملی', unit: 'ریال/تن', icon: CopperIcon, source: 'بورس کالا (IME)' },
    { key: 'GOLD_COIN_EMAMI', name: 'سکه امامی', unit: 'ریال', icon: GoldIcon, source: 'BrsApi.ir' },
    { key: 'GOLD_GLOBAL', name: 'طلای جهانی', unit: 'دلار/اونس', icon: GoldIcon, source: 'LME' },
    { key: 'COPPER_LME', name: 'مس جهانی', unit: 'دلار/تن', icon: CopperIcon, source: 'LME' },
    { key: 'SILVER_GLOBAL', name: 'نقره جهانی', unit: 'دلار/اونس', icon: SilverIcon, source: 'LME' },
    { key: 'ALUMINUM_LME', name: 'آلومینیوم جهانی', unit: 'دلار/تن', icon: AluminumIcon, source: 'LME' },
];