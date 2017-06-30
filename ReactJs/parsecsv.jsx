
class CsvModal extends React.Component{
    constructor(props){
        super(props);
        this.state = {
                displayme: this.props.displayme
        }; 
    }
    render() {
        
      var that=this;
        return (
                <div className={that.state.displayme}>
                <div className="modalborder">                
                    <div>
                        <div className="innerborder">
                            <div className="content">
                            <img src="images/closebutton.png" alt="Close" className="closbtnimg" onClick={that.handleCloseTheModal=that.handleCloseTheModal.bind(that)} className="closeModal"/>
                            <div className="toptext">
                                Import Terms
                            </div>
                            <span className="hline hlinetop"></span>
                            <div className="middle">
                               Upload a CSV or plain text fle containing one term and severity level(1-3) per row separated by a comma. Max 500 lines.
                               <div className="chooseline">
                                   
                                   <input className="filepicker" id="choosefile" type="file"/>      
                                   
                               </div>
                            </div>
                           <span className="hline hlinebottom"></span>
                            <div className="bottomtext">
                                <div className="bottombtns">
                                   <div className="btns cancelbtn" onClick={that.handleCancel=that.handleCancel.bind(that)}>Cancel</div>
                                   <div className="btns importbtn" onClick={that.handleImport=that.handleImport.bind(that)}>Import</div>
                                </div>
                            </div>  
                            </div>
                        </div>
                    </div>                  
                </div>
                </div>
        );
    }
    handleCloseTheModal(event){
        event.stopPropagation();
        alert("inside handleCloseTheModal");
        this.setState({
            displayme: "hide"
        });
    }
    handleChooseFile(event){
        event.stopPropagation();
        alert("clicked on handleChooseFile");
    }
    handleCancel(event){
        event.stopPropagation();
        alert("clicked on handleCancel");

    }
    handleImport(event){
        event.preventDefault();
        alert("clicked on handleImport");
 
    }
}

const appData = {
        title: 'React Demo App'
      }
ReactDOM.render(
        /*
        <ParseCsv data={appData}/>, document.getElementById('root')
        */
        <CsvModal displayme="show"/>, document.getElementById('root')
      );
