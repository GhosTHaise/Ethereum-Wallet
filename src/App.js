import {useState,useEffect} from 'react';
import {ethers} from 'ethers';
import Wallet from './artifacts/contracts/Wallet.sol/Wallet.json';
import './App.css';


function App() {
    //Mes States
  const walletAddress = '0xa94716dAD0457170ab25083afC0809BD311aC9A4';
  const [Balance,setBalance] = useState(0);
  const [AmountSend,setAmountSend] = useState();
  const [AmountWithDraw,setAmountWithDraw] = useState();
  const [Error,setError] = useState('');
  const [Success,SetSuccess] = useState(''); 
  //Mes State --end

  useEffect(()=> {
    getBalance( )
  },[])
  window.ethereum.addListener('accountsChanged', async() => {
    getBalance();
  })
  const getBalance = async() => {
    if(typeof window.ethereum !== 'undefined'){
      const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const Contract = new ethers.Contract(walletAddress,Wallet.abi,provider);
      try{
        const data = await Contract.getBalance({from :accounts[0]});  
        setBalance(String(data));
      }catch(error){
        setError("une erreur est survenu : "+error.message);
      }
    }
  }
  //FlushError
  const FlushMessage = () =>{
    setError('');
    SetSuccess('');
  }
  //fonction Tranfert
  const changeAmountSend = (e) => {
    setAmountSend(e.target.value);
  }
  const transfer = async() => {
    if(!AmountSend){
      return;
    }
     FlushMessage();
     if(typeof window.ethereum !== 'undefined'){
       const accounts = await window.ethereum.request({method : 'eth_requestAccounts'});
       const provider = new ethers.providers.Web3Provider(window.ethereum);
       const signer = provider.getSigner();
       try{
         const tx ={
           from: accounts[0],
           to: walletAddress,
           value: ethers.utils.parseEther(AmountSend)
              }
          const transaction = await signer.sendTransaction(tx)
          await transaction.wait();
          setAmountSend('');
          getBalance();
          SetSuccess("Votre argent a bien ete transfere sur le porte feuille !");
       }catch(error){
         setError("Une erreur s'est produite !")
         console.log(error);
       }
     }
  }
  //Fin fonction Transfert
  //Fonction Retrait
  const changeAmountWithDraw = (e) => {
    setAmountWithDraw(e.target.value);
  }
  const withDraw = async() => {
    if(!AmountWithDraw){
      return;
    }
    FlushMessage();
    const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const Contract = new ethers.Contract(walletAddress,Wallet.abi,signer);
    try{
      const transaction = await Contract.transfertMoney(accounts[0],ethers.utils.parseEther(AmountWithDraw));
      await transaction.wait();
      setAmountWithDraw('');
      getBalance();
      SetSuccess("Votre argent a bien ete retire !");
    }catch(error){
      setError('Une erreur est survenue');
    }
  }
  return (
    
    <div className="App">
      <div className='container' >
        <div className='logo' >
          <i className='fab fa-ethereum'></i>
        </div>
        {Error && <p className='error'>{Error}</p>}
        {Success && <p className='success'>{Success}</p>}
        <h2>{Balance / 10**18} <span className='eth' >eth</span> </h2>
        <div className='wallet_flex'>
          <div className='walletG'>
            <h3>Envoyer de l'Ether</h3>
            <input type='text' placeholder='Montant en Ethers' onChange={changeAmountSend} />
            <button onClick={transfer}>Deposer</button>
          </div>
          <div className='walletD'>
            <h3>Retirer de l'Ether</h3>
            <button onClick={withDraw}>Retirer</button>
            <input type='text' placeholder='Montant en Ethers' onChange={changeAmountWithDraw}/>
          </div>
        </div>
    </div>
      </div>
        
  );
}

export default App;
