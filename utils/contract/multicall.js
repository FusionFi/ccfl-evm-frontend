import MultiCallAbi from '@/utils/contract/abi/multicall.json';
import { getWeb3 } from '@/utils/contract/web3';
import { Interface } from '@ethersproject/abi';

const MULTI_CALL_ADDRESS = process.env.NEXT_PUBLIC_MULTICALL_ADDRESS;

const multicall = async (provider, abi, calls) => {
  const web3 = getWeb3(provider);
  const multi = new web3.eth.Contract(MultiCallAbi, MULTI_CALL_ADDRESS);
  const itf = new Interface(abi);

  const calldata = calls.map(call => [
    call.address.toLowerCase(),
    itf.encodeFunctionData(call.name, call.params),
  ]);
  const { returnData } = await multi.methods.aggregate(calldata).call();
  const res = returnData.map((call, i) => {
    try {
      return itf.decodeFunctionResult(calls[i].name, call);
    } catch (error) {
      return null;
    }
  });

  return res;
};

export default multicall;
