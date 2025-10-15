import { Wallet } from "@coinbase/onchainkit/wallet";
import React from "react";

const page = () => {
  return (
    <div>
      <Wallet />
      <p className="text-2xl">Hello world</p>
    </div>
  );
};

export default page;
