import { Selection } from '../types';
import {
  getPrice,
  getSizeLabel,
  parseSize,
  parsePercent,
  parseSplitMax,
  parseLeverage,
} from '../utils/parse';

interface Props {
  left: Selection;
  right: Selection;
}

type Better = 'left' | 'right' | 'equal';

interface Row {
  label: string;
  leftVal: string;
  rightVal: string;
  // numeric comparison: which is better
  better: Better;
}

const buildRows = (l: Selection, r: Selection): Row[] => {
  const lr = l.account.rules;
  const rr = r.account.rules;

  const lSize = parseSize(getSizeLabel(l));
  const rSize = parseSize(getSizeLabel(r));
  const lPriceRatio = lSize ? getPrice(l) / lSize : 1;
  const rPriceRatio = rSize ? getPrice(r) / rSize : 1;

  const cmp = (a: number, b: number, higherBetter: boolean): Better => {
    if (a === b) return 'equal';
    if (higherBetter) return a > b ? 'left' : 'right';
    return a < b ? 'left' : 'right';
  };

  const lDD = parsePercent(lr.maxDrawdown);
  const rDD = parsePercent(rr.maxDrawdown);
  const ddComparable = !lr.maxDrawdown.includes('$') && !rr.maxDrawdown.includes('$');

  const lTarget = parsePercent(lr.phase1Target);
  const rTarget = parsePercent(rr.phase1Target);
  const tgtComparable = !lr.phase1Target.includes('$') && !rr.phase1Target.includes('$') && lTarget > 0 && rTarget > 0;

  return [
    {
      label: 'Price',
      leftVal: `$${getPrice(l)}`,
      rightVal: `$${getPrice(r)}`,
      better: cmp(lPriceRatio, rPriceRatio, false),
    },
    {
      label: 'Profit Target',
      leftVal: lr.phase1Target + (lr.phase2Target && !lr.phase2Target.includes('N/A') ? ` + ${lr.phase2Target}` : ''),
      rightVal: rr.phase1Target + (rr.phase2Target && !rr.phase2Target.includes('N/A') ? ` + ${rr.phase2Target}` : ''),
      better: tgtComparable ? cmp(lTarget, rTarget, false) : 'equal',
    },
    {
      label: 'Daily Loss',
      leftVal: lr.dailyLoss,
      rightVal: rr.dailyLoss,
      better: cmp(parsePercent(lr.dailyLoss), parsePercent(rr.dailyLoss), true),
    },
    {
      label: 'Max Drawdown',
      leftVal: `${lr.maxDrawdown} (${lr.drawdownType})`,
      rightVal: `${rr.maxDrawdown} (${rr.drawdownType})`,
      better: ddComparable ? cmp(lDD, rDD, true) : 'equal',
    },
    {
      label: 'Profit Split',
      leftVal: lr.profitSplit,
      rightVal: rr.profitSplit,
      better: cmp(parseSplitMax(lr.profitSplit), parseSplitMax(rr.profitSplit), true),
    },
    {
      label: 'Leverage',
      leftVal: lr.leverage,
      rightVal: rr.leverage,
      better: cmp(parseLeverage(lr.leverage), parseLeverage(rr.leverage), true),
    },
    {
      label: 'Payout',
      leftVal: lr.payoutFrequency,
      rightVal: rr.payoutFrequency,
      better: 'equal',
    },
    {
      label: 'Refund',
      leftVal: lr.refund,
      rightVal: rr.refund,
      better: 'equal',
    },
    {
      label: 'Scaling',
      leftVal: lr.scaling,
      rightVal: rr.scaling,
      better: 'equal',
    },
    {
      label: 'Restrictions',
      leftVal: lr.consistencyRule === 'None' ? 'Low' : `Consistency ${lr.consistencyRule}`,
      rightVal: rr.consistencyRule === 'None' ? 'Low' : `Consistency ${rr.consistencyRule}`,
      better: 'equal',
    },
  ];
};

const cellCls = (side: Better, current: 'left' | 'right') => {
  if (side === current) return 'text-[#00E7A7] font-semibold';
  if (side === 'equal') return 'text-white';
  return 'text-[#8E9BB5]';
};

const ComparisonTable = ({ left, right }: Props) => {
  const rows = buildRows(left, right);

  return (
    <div className="bg-[#0B1026] p-6 md:p-8 rounded-3xl border border-white/5 mt-10 overflow-x-auto">
      <h3 className="text-2xl font-bold mb-6">Detailed Comparison</h3>
      <table className="w-full text-left min-w-[600px]">
        <thead>
          <tr className="text-[#8E9BB5] text-sm">
            <th className="pb-4 font-medium">Feature</th>
            <th className="pb-4 font-medium">
              <span className="text-[#6C63FF]">{left.firm.name}</span>
              <div className="text-xs font-normal">{left.account.name} · {getSizeLabel(left)}</div>
            </th>
            <th className="pb-4 font-medium">
              <span className="text-[#00D5FF]">{right.firm.name}</span>
              <div className="text-xs font-normal">{right.account.name} · {getSizeLabel(right)}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-white/5">
              <td className="py-4 text-[#8E9BB5] text-sm">{row.label}</td>
              <td className={`py-4 text-sm ${cellCls(row.better, 'left')}`}>{row.leftVal}</td>
              <td className={`py-4 text-sm ${cellCls(row.better, 'right')}`}>{row.rightVal}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-4 mt-6 text-xs text-[#8E9BB5] flex-wrap">
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#00E7A7]" /> Better value</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-white" /> Balanced</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#8E9BB5]" /> Weaker</span>
      </div>
    </div>
  );
};

export default ComparisonTable;
