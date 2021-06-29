import React, { Component } from 'react'
import dai from '../dai.png' //importamos aqui a foto


class Main extends Component {

  

  render() {
    return (
        <div id="content" className="mt-3">


         <table className="table table-borderless tesxt-muted text-center">
           <thead>
             <tr>
               <th scope="col">Saldo Apostador</th> 
               <th scope="col">Saldo de recompensa</th>
               </tr>
               </thead>
               <tbody>
                 <tr>
                   <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} mDAI</td>
                   <td>{window.web3.utils.fromWei(this.props.dappTokenBalance, 'Ether')} DAPP</td>
                  </tr>
                </tbody>
           </table>

           <div className="card mb-4">

           <div  className="card-body">
             
             <form className="mb-3" onSubmit={(event)=> {
               event.preventDefault()
               let amount
               amount = this.input.value.toString() //esta ligado ao input dos códigos abaixo
               amount = window.web3.utils.toWei(amount, 'Ether')
               this.props.stakeTokens(amount)
             }}>
               <div> 
                <label className="float-left"><b>Tokens de Aposta</b></label>
                <span className="float-right text-muted">
                 Balance: {window.web3.utils.fromWei(this.props.daiTokenBalance, 'Ether')}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                   type = "text"
                   ref={(input)=> {this.input = input}} // aqui siginifica que o valor que colocarmos dentro da caixa de tokens de aposta será retirado do monstante (amount) e acrescido no valor
                   className="form-control form-control-lg"
                   placeholder="0"
                   required />
            <div className= "input-group-append">
              <div className="input-group-text">
                <img src={dai} height='32' alt=""/>
                &nbsp;&nbsp;&nbsp;mDAI
                </div>
              </div>
            </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">APOSTAR!</button>  
            </form>
            <button
            type="submit"
            className="btn btn-link btn-block btn-sm"
            onClick={(event) =>{
              event.preventDefault()
              this.props.unstakeTokens()
            }}>
              RETIRAR APOSTA..
              </button>



            </div>
            </div>

      </div>
    );
  }
}

export default Main;