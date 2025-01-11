/**
 * Adding react
 */
import React, { useMemo } from 'react';
/**
 * Add the blockchain type for WalletBallance and getPriority function to remove
 * any usage of any
 *  */ 
type BlockChain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo'

interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: BlockChain;
  }
  interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
  }
  
  // For prettier if we dont want to add anything we could just put {}
  interface Props extends BoxProps {}

  /**
   * Brings the getPriority outside the component 
   * to prevent this function being rerendered many times
   * and fix previously using switch case we can use object
   * to easier and faster identification
   * 
   * @param blockchain 
   * @returns number
   */
  const getPriority = (blockchain: BlockChain): number => {
    const priorities: { [key: string]: number } = {
        'Osmosis': 100,
        'Ethereum': 50,
        'Arbitrum': 30,
        'Zilliqa': 20,
        'Neo': 20,
      };
      return priorities[blockchain] ?? -99;
  }

  const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

  
    /**
     * 1. Remove the price on dependencies as price is not used in inside this function
     * if we still put it as dependecies it could bring a performance issue as react will
     * try to compare prices too instead of balances only
     * 2. changing the lhs priority to balancepriority as lhs priority is not defined
     * 3. Remove the formatted variable as adding more variable causing more memories to fill up,
     * and add on the sortedBalances function to prevent any unnecessary re-render
     */
    const sortedBalances = useMemo(() => {
      return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            /**
             * To filter only the balance priority > -99 and amount > 0
             * we could refactor it this way
             */
            return balancePriority > -99 && balance.amount> 0;
          }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
              const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            /**
             * For descending we can easily put b - a
             */
            return  rightPriority - leftPriority;
            }).map((balance: WalletBalance) => ({
        ...balance,
        formatted: balance.amount.toFixed()
      }));
    }, [balances]);
  
    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const price = prices[balance.currency]
    /**
     * Add fallback as if the prices is undefined
     */
      const usdValue = price ? prices[balance.currency] * balance.amount : '-';
    /**
     * Remove the class name as its not defined
     */
      return (
        <WalletRow 
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      )
    })
  
    return (
      <div {...rest}>
        {rows}
      </div>
    )
  }


/**
 * Dont forget to export the current component
 */
export default WalletPage;