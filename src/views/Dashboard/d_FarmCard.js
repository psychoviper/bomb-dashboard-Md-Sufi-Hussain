import React, {useMemo} from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardActions, CardContent, Typography, Grid } from '@material-ui/core';
import styled from 'styled-components';
import TokenSymbol from '../../components/TokenSymbol';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';

import useStatsForPool from '../../hooks/useStatsForPool';
import Value from '../../components/Value';
import useEarnings from '../../hooks/useEarnings';
import useBombStats from '../../hooks/useBombStats';
import useShareStats from '../../hooks/usebShareStats';
import useStakedBalance from '../../hooks/useStakedBalance';
import {getDisplayBalance} from '../../utils/formatBalance';
import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';


const FarmCard = ({ bank }) => {
  const { account } = useWallet();
  const earnings = useEarnings(bank.contract, bank.earnTokenName, bank.poolId);
  const bombStats = useBombStats();
  const tShareStats = useShareStats();

  const tokenName = bank.earnTokenName === 'BSHARE' ? 'BSHARE' : 'BOMB';
  const tokenStats = bank.earnTokenName === 'BSHARE' ? tShareStats : bombStats;
  const h_tokenPriceInDollars = useMemo(
    () => (tokenStats ? Number(tokenStats.priceInDollars).toFixed(2) : null),
    [tokenStats],
  );
  const h_earnedInDollars = (Number(h_tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

  const stakedBalance = useStakedBalance(bank.contract, bank.poolId);
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(bank.depositTokenName, bank.depositToken);

  const tokenPriceInDollars = useMemo(
    () => (stakedTokenPriceInDollars ? stakedTokenPriceInDollars : null),
    [stakedTokenPriceInDollars],
  );
  const earnedInDollars = (
    Number(tokenPriceInDollars) * Number(getDisplayBalance(stakedBalance, bank.depositToken.decimal))
  ).toFixed(2);

   let statsOnPool = useStatsForPool(bank);

  let depositToken = bank.depositTokenName.toUpperCase();
  if (depositToken === '80BOMB-20BTCB-LP') {
    depositToken = 'BOMB-MAXI';
  }
  if (depositToken === '80BSHARE-20WBNB-LP') {
    depositToken = 'BSHARE-MAXI';
  }
  return (
    <Grid item xs={12} md={4} lg={4}>
      <Card variant="outlined">
        <CardContent align="center">
          <Box style={{ position: 'relative' }}>
            <Box
              style={{
                position: 'absolute',
                right: '0px',
                top: '-5px',
                height: '48px',
                width: '48px',
                borderRadius: '40px',
                backgroundColor: '#363746',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <TokenSymbol size={32} symbol={bank.depositTokenName} />
            </Box>
            <Typography variant="h5" component="h2">
              {bank.depositTokenName}
            </Typography>
            <Typography color="textSecondary">
              {/* {bank.name} */}
              Deposit {depositToken.toUpperCase()} Earn {` ${bank.earnTokenName}`}
            </Typography>
            <span style={{ fontSize: '12px' }}>
                APR: ${bank.closedForStaking ? '0.00' : statsOnPool?.yearlyAPR}% <br />
                Daily APR:${bank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}%<br />
                TVL:${statsOnPool?.TVL}
                
              
            </span>
            
            <Box > 
            <br></br>
              <Typography style={{textalign:"center",textTransform: 'uppercase', color: '#f9d749'}}>
              {`${tokenName} Earned`}
              <Value value={getDisplayBalance(earnings)} />
                          <Typography style={{textalign:"center",textTransform: 'uppercase', color: '#fffff'}}>
                      {`≈ $${h_earnedInDollars}`}
                    </Typography>
            {/* <Label text={`≈ $${earnedInDollars}`} /> */}
                  
                    </Typography>
             {/* <Label text={`${tokenName} Earned`} /> */}
             <Typography style={{textalign:"center",textTransform: 'uppercase', color: '#f9d749'}}>
                {`${bank.depositTokenName} Staked`}
              <Value value={getDisplayBalance(stakedBalance, bank.depositToken.decimal)} />

                    <Typography style={{textalign:"center",textTransform: 'uppercase', color: '#fffff'}}>
                        {`≈ $${earnedInDollars}`}
                </Typography>
                
                    </Typography>
            </Box>
                
              
              
            {/* <Typography color="textSecondary" style={{textAlign: 'center'}}>APR</Typography>
            <Typography color="textSecondary" style={{textAlign: 'center'}}>{bank.closedForStaking ? '0.00' : statsOnPool?.yearlyAPR}%</Typography>
            <Typography color="textSecondary" style={{textAlign: 'center'}}>Daily APR</Typography>
            <Typography color="textSecondary" style={{textAlign: 'center'}}>{bank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}%</Typography>
            <Typography color="textSecondary" style={{textAlign: 'center'}}>TVL</Typography>
            <Typography color="textSecondary" style={{textAlign: 'center'}}>${statsOnPool?.TVL}</Typography> */}
           </Box>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          {!!account ? (
              <Button className="shinyButtonSecondary" component={Link} to={`/farm/${bank.contract}`}>
                  View
              </Button>
          ) : (
              <UnlockWallet />
          )}
        </CardActions>
      </Card>
    </Grid>
  );
};

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;


export default FarmCard;