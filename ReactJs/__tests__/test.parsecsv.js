import React from 'react';
import ReactDOM from 'react-dom'
import TestUtils from 'test-utils';
import {shallow} from 'enzyme';
import ParseCsvModal from '../parsecsv.jsx';


test('Modal should display',()=>{
	//Render the UI
	const modal=shallow(<ParseCsvModal displayme="show"/>);
	var chooser=modal.find('[id="choosefile"]');
    expect(chooser).toMatchSnapshot();
    //type: [Function: ParseCsvModal]
});
	

   
describe('ParseCsvModal',()=>{
    it('renders without crashing',()=>{
        const div=document.createElement('div');
        ReactDOM.render(<ParseCsvModal displayme="show"/>,div);
    });	
    
    describe('Test Button Clicks',() =>{
    	it('testing processContents',() => {
    		
    		const test_data="banana,3\npeach,10\nwatermelon,3";

    	    const parser=shallow(<ParseCsvModal displayme="show"/>);
    	    var result=parser.instance().processContents(test_data);
    	    expect(result.length).toEqual(3);
    	});
    	/*Test clicking of file input*/
        it('test handleChooseFile', () => {
        	const parser=shallow(<ParseCsvModal displayme="show"/>);
        	var found=parser.find('[id="choosefile"]').simulate('click');
        	expect(parser).toMatchSnapshot();
        });
    	/*Test clicking of file input*/
        it('test handleCancel', () => {
        	const parser=shallow(<ParseCsvModal displayme="show"/>);
        	var found=parser.find('[id="canclebtn"]').simulate('click');
        	expect(parser).toMatchSnapshot();
        });        
    	/*Test clicking of Import butont*/
        it('test handleImport', () => {
        	const parser=shallow(<ParseCsvModal displayme="show"/>);
        	var found=parser.find('[id="importbtn"]').simulate('click');
        	expect(parser).toMatchSnapshot();
        });        
 
        	
    });  
});



