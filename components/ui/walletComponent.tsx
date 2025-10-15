import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
const WalletComponent = () => {
  return (
    <Wallet>
      <ConnectWallet
        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/50 transition-all duration-300 text-sm px-4 py-2 flex items-center gap-x-2"
        disconnectedLabel="Log In"
      >
        <Avatar className="h-6 w-6 ring-2 ring-cyan-300" />
        <Name className="text-white font-semibold" />
      </ConnectWallet>
      <WalletDropdown className="bg-slate-900 border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 h-20">
        <Identity
          className="px-4 pt-3 pb-2 hover:bg-gradient-to-r hover:from-slate-800 hover:to-slate-700 transition-all duration-200 border-b border-cyan-500/20 flex"
          hasCopyAddressOnClick
        >
          <Avatar className="h-8 w-8 ring-2 ring-cyan-400 rounded-full" />
          <Name className="text-cyan-400 font-bold" />
          <Address className="text-slate-400 text-sm font-mono" />
          <EthBalance className="text-emerald-400 font-semibold" />
        </Identity>
        <WalletDropdownDisconnect className="hover:bg-gradient-to-r hover:from-red-900/50 hover:to-slate-800 text-slate-300 hover:text-red-400 transition-all duration-200" />
      </WalletDropdown>
    </Wallet>
  );
};

export default WalletComponent;
