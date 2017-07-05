import React from 'react';
import $ from 'jquery';

/*
 * properties.json contains the server url to upload the content to, this
 * satisfies one of the acceptance criteria 
 */
import config from './properties.json'

export default class ParseCsvModal extends React.Component{
    constructor(props){
        super(props);
        this.state = {
                displayme: this.props.displayme,
                file_path:''
        }; 
        this.upload_data=[];
    }
    render() {
        
      var that=this;
        return (
                <div className={that.state.displayme}>
                <div className="modalborder">                
                    <div>
                        <div className="innerborder">
                            <div className="content">
                            <a id="closebtn" className="ptr boxclose" id="closexbutton" onClick={that.handleCloseTheModal=that.handleCloseTheModal.bind(that)}><span className="closeposition">X</span></a>
                            
                            <div className="toptext">
                                Import Terms
                            </div>
                            <span className="hline hlinetop"></span>
                            <div className="middle">
                               Upload a CSV or plain text fle containing one term and severity level(1-3) per row separated by a comma. Max 500 lines.
                               <div className="chooseline">
                                   
                                   <input className="ptr filepicker" id="choosefile" type="file" name="inputfile" onChange={that.handleChooseFile=that.handleChooseFile.bind(that)} value={that.state.file_path}/>      
                                   
                               </div>
                            </div>
                           <span className="hline hlinebottom"></span>
                            <div className="bottomtext">
                                <div className="bottombtns">
                                   <div id="canclebtn" className="ptr btns cancelbtn" onClick={that.handleCancel=that.handleCancel.bind(that)}>Cancel</div>
                                   <div id="importbtn" className="ptr btns importbtn" onClick={that.handleImport=that.handleImport.bind(that)}>Import</div>
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
        if(event){
            event.stopPropagation();
        }
        this.setState({
            displayme: "hide"
        });
    }
    handleChooseFile(event){        
        var that=this;
        var input='';
        if(event){
            event.stopPropagation();
            input=event.target.files[0];
        }
        else{
            input='./test.csv.data';
        }
        /*Make sure that the user selected a file*/
        if (input) {
            /*We change the displayed file name in the UI*/
            that.setState({
                             file_path:input.name
                           });
            /*Now we load the file*/
            var r = new FileReader();
            r.onload = function(e) { 
                var contents = e.target.result;
                /*Make sure that contents isn't empty and has values*/
                if(contents){     
                    that.upload_data=that.processContents(contents);
                }
                else{
                    alert('The file selected could not be loaded, please select another file.')
                }
            }
            var text=r.readAsText(input);
          } else { 
            alert("Failed to load file");
          }
    }
    processContents(contents){
        var that=this;
        /*Make sure we empty out the data to be uploaded*/
        var retVal=[];
        /*
         * We go through each line and parse each line accordingly, adding to
         * upload_data so we can later make a post call to the server
         */
        var lines = contents.split('\n');
        
        if(lines && lines.length>0){
            var count=0;
            var total_lines=lines.length;
            for(var line = 0; line < total_lines; line++){
                var aline=lines[line];
                
                var parts=aline.split(',');
                if(parts){                                
                    var parts_length=parts.length;
                    /*
                     * As long as there is a term and a value, create a JSONArray with the respective
                     * term and value and add it to the upload_data array
                     */
                    if(2==parts_length){
                        var a_record=[];
                        a_record.push(parts[0]);
                        a_record.push(parts[1]);
                        retVal.push(a_record);
                        ++count;
                    }                        
                }
            }
            console.log('Successfully imported '+count +' out of '+total_lines)
        }
        /*The file is empty and has no lines*/
        else{
           alert('The file selected is empty, pleas select another file') 
        }   
        return retVal;
    }
    handleCancel(event){
        if(event){
            event.stopPropagation();
        }
        var that=this;
        that.upload_data=[];
        that.setState({displayme:"show",file_path:""})
    }
    handleImport(event){
        if(event){
            event.preventDefault();
        }
        var that=this;
        if(that.upload_data){
            var upload_data_length=that.upload_data.length; 
            /* There is no data to upload prompt the user to choose a file with valid data*/
            if(upload_data_length==0){
                alert('No data has been loaded, please select a valid file valid data and try to import again.')
            }
            else{                
                if(config.serverurl){
                    alert(config.serverurl);
                    fetch(config.serverurl,{headers:{'Accept':'application/json',
                                                     'Content-Type':'application/json'
                                                    },
                                            method:'POST',
                                            body: that.upload_data
                    })
                    .then(function(response){
                        if(response.status==400){
                            alert("Server Error");
                        }
                        if(response.statusText=="No Content"){
                            alert("No connection to "+config.serverurl+", search failed");                    
                        }
                        else{          
                            return response.json();
                        }
                    })
                    .then(function(data){
                        /*
                         * We successfully received a response from the server, just close the modal
                         * as required to satisfy an acceptance criteria 
                         */
                         that.setState({
                             displayme: "hide"
                         });
                    }) 
                }
                else{
                    alert('There is no serverul configured, please make sure properties.json is properly configured');
                }
            }
        }
        else{
            alert('No data has been loaded, please select a file with valid data and try to import again.')
        }
 
    }
}


