import { Firm, Selection } from '../types';

interface Props {
  firms: Firm[];
  selection: Selection;
  onChange: (sel: Selection) => void;
  accent: string;
}

const labelCls = 'block text-xs uppercase tracking-wider text-[#8E9BB5] mb-2';
const selectCls =
  'w-full bg-[#05081A] border border-white/10 text-white p-3 rounded-xl mb-4 focus:outline-none focus:border-[#6C63FF] transition appearance-none cursor-pointer';

const AccountSelector = ({ firms, selection, onChange, accent }: Props) => {
  const handleFirm = (firmId: string) => {
    const firm = firms.find((f) => f.id === firmId)!;
    onChange({ firm, account: firm.accounts[0], sizeIndex: 0 });
  };

  const handleAccount = (accId: string) => {
    const account = selection.firm.accounts.find((a) => a.id === accId)!;
    onChange({ ...selection, account, sizeIndex: 0 });
  };

  const handleSize = (idx: number) => {
    onChange({ ...selection, sizeIndex: idx });
  };

  return (
    <div>
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm mb-4"
        style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}55` }}
      >
        {selection.firm.logo}
      </div>

      <label className={labelCls}>Select Firm</label>
      <select
        className={selectCls}
        value={selection.firm.id}
        onChange={(e) => handleFirm(e.target.value)}
      >
        {firms.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>

      <label className={labelCls}>Select Account</label>
      <select
        className={selectCls}
        value={selection.account.id}
        onChange={(e) => handleAccount(e.target.value)}
      >
        {selection.firm.accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name} ({a.type})
          </option>
        ))}
      </select>

      <label className={labelCls}>Select Size</label>
      <select
        className={selectCls}
        value={selection.sizeIndex}
        onChange={(e) => handleSize(parseInt(e.target.value))}
      >
        {selection.account.sizes.map((s, i) => (
          <option key={s.size} value={i}>
            {s.size} — ${s.price}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AccountSelector;
