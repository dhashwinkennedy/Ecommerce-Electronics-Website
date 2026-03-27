import React from "react"
import './ProductSpecModel.css'

const ProductSpecModel = ({Data}) => {
    const element = (title,ans) =>{
        return(
            <>
            <div className="vertical-line"></div> 

            <div className="column">
                <h3>{title}</h3>
                <span className="answer-span">{ans}</span>
            </div>
        </>
        )
    
    }
    const con_element = (con,title,ans) =>{
        if (Data.category===con){
        return(
            <>
            <div className="vertical-line"></div> 

            <div className="column">
                <h3>{title}</h3>
                <span className="answer-span">{ans}</span>
            </div>
        </>
        )}
        else{
            
        }
    
    }
    const con2_element = (con1,con2,title,ans) =>{
        if (Data.category===con1 && con2){
        return(
            <>
            <div className="vertical-line"></div> 

            <div className="column">
                <h3>{title}</h3>
                <span className="answer-span">{ans}</span>
            </div>
        </>
        )}
        else{
            
        }
    
    }
    
    return(
        <div className={`productSpecModel-main-content ${Data.category}`}>
            <h2 className="productSpecModel-model-title accent">Product Specifications</h2>
            <div className="productSpecModel-body">
            
                <div className="row"> 
                    {element("Device Type",Data.category)}
                    {con_element("Laptop","Purpose",Data.purpose)}           
                    {element("Product ID",Data._id)}

                
            
                </div>

                {/*section 1*/}


            <div className="detail-sec">
            <h2 className="productSpecModel-model-subtitle accent">Processor Details:</h2>

                <div className="row"> 
                    {element('Processor Brand',Data.processor.brand)}
                    {element('Processor Model',Data.processor.model)}
                    {con_element('Laptop','Processor Varient',Data.processor.varient)}
                    {con_element('Mobile','Number of Cores',Data.processor.cores)}
                </div>
                 <div className="row">
                    {con_element('Laptop','Number of Cores',Data.processor.cores)}
                    {con_element('Laptop','Processor Cache',Data.processor.speed)}
                    {con_element('Laptop','Maximum Turbo Speed',Data.processor.max_speed)}
                </div>
                </div>


                {/*section 2*/}


            <div className="detail-sec">
            <h2 className="productSpecModel-model-subtitle accent">Graphics Details</h2>
            <div className="row"> 
                    {element('Graphics Brand',Data.GPU.brand)}
                    {element('Graphics Model',Data.GPU.model)}
                    {con_element('Laptop','Graphics Type',Data.GPU.type)}
                </div>
                 <div className="row">
                    {con_element('Laptop','Graphics Memory',Data.GPU.memory)}
                </div>

                
                </div>

            {/*section 3*/}


            <div className="detail-sec">
            <h2 className="productSpecModel-model-subtitle accent">Storage & Memory</h2>
            <div className="row"> 
                    {element('Ram Memory',Data.ram.memory)}
                    {element('Storage Capacity',Data.storage.storage)}
                    {con_element('Laptop','Ram Technology',Data.ram.technology)}
                    {con_element('Mobile','Max Storage Capacity',Data.storage.card_capacity)}

                </div>
                 <div className="row">
                    {con_element('Laptop','Storage Technology',Data.storage.technology)}
                    {con_element('Mobile','Memory Card Support',Data.storage.memory_card_support)}
                    {con_element('Mobile','Memory Card Slot Technology',Data.storage.memory_card_slot_technology)}
                    {con_element('Mobile','OTG Support',Data.storage.OTG)}
                </div>
            </div>

            {/*section 4*/}


            <div className="detail-sec">
            <h2 className="productSpecModel-model-subtitle accent">Display</h2>
                <div className="row"> 
                    {element('Display Technology',Data.display.technology)}
                    {element('Refresh Rate',Data.display.refresh_rate)}
                    {element('Display Resolution',Data.display.resolution)}


                </div>
                 <div className="row">
                    {element('Brightness',Data.display.brightness)}
                    {element('Display Size',Data.display.size)}
                    {con_element('Laptop','Display Ratio',Data.display.ratio)}

                </div>
                <div className="row">
                    {con_element('Laptop','Touch',Data.display.touch)}
                    {con_element('Laptop','Additional',Data.display.additional)}
                    
                </div>
            </div>

            {/*section 4*/}


            <div className="detail-sec">
            <h2 className="productSpecModel-model-subtitle accent">Operating System</h2>
                <div className="row"> 
                    {element('OS Brand',Data.OS.brand)}
                    {element('OS Type',Data.OS.type)}
                    {element('OS Version',Data.OS.version)}
                </div>
        
                <div className="row">
                    {con_element('Mobile','User Interface',Data.OS.UI)}
                    {con_element('Mobile','OS Updates',Data.OS.update)}
                    {con_element('Mobile','Security',Data.OS.security_update)}
                </div>
            </div>

            {/*section 5*/}


            <div className="detail-sec">
            <h2 className="productSpecModel-model-subtitle accent">Ports & Slots</h2>
                <div className="row"> 
                    {element('Audio Jack Port',Data.slots.audio)}
                    {con_element('Laptop','Number Of USB Ports',Data.slots.USB_ports)}
                    {con_element('Laptop','USB Types Supported',Data.slots.USB_types)}
                    {con_element('Mobile','Number of SIMs Slots',Data.slots.sim_slots)}
                    {con_element('Mobile','SIM Type',Data.slots.sim_type)}
                </div>
        
                <div className="row">
                    {con_element('Mobile','Hybrid SIM Slot',Data.slots.hybrid_slot)}
                    {con_element('Laptop','Number Of HDMI Ports',Data.slots.HDMI)}
                </div>
            </div>

            
            {/*section 5*/}


            <div className="detail-sec">
            <h2 className="productSpecModel-model-subtitle accent">Network Technology & Connectivity</h2>
                <div className="row"> 
                    {element('Bluetooth Technology',Data.network.bluetooth)}
                    {element('WiFI Technology',Data.network.wifi)}
                    {con_element('Mobile','Cellular Technology',Data.network.cellular)}
                </div>
        
                <div className="row">
                    {con_element('Mobile','Network Technology',Data.network.network_technology)}
                    {con_element('Mobile','Infrared',Data.network.infrared)}

                </div>
            </div>

            {/*section 6*/}


            <div className="detail-sec">
            <h2 className="productSpecModel-model-subtitle accent">Manufacturer Details</h2>
                <div className="row"> 
                    {element('Brand',Data.brand)}
                    {element('Model Series',Data.model_series)}
                    {element('Model Number',Data.model_number)}

                </div>
        
        
            </div>
             {/*section 7*/}


            <div className="detail-sec">
            <h2 className="productSpecModel-model-subtitle accent">Battery & Power</h2>
                <div className="row"> 
                    {element('Battery Technology',Data.power.technology)}
                    {con_element('Mobile','Battery Type',Data.power.type)}
                    {element('Fast Charging Support',Data.power.fast_charging)}
                    {con_element('Laptop','Number Of Cells',Data.power.cells)}
                </div>
                <div className="row"> 
                    {con_element('Mobile','Battery Capacity',Data.power.capacity)}
                    {con_element('Mobile','Charging Pin Type',Data.power.pin)}
                    {con_element('Mobile','Additional Features',Data.power.additional)}
                    {con_element('Laptop','Battery Charge Time',Data.power.time)}
                    {con_element('Laptop','Power Consumption',Data.power.power)}

                </div>
        
        
            </div>


            </div>
        </div>
    )
}

export default ProductSpecModel;