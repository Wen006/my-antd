import React from 'react'; 
import { Input } from 'antd'
const FuncDemo = ({}) => {

    return (
        <div>
            hello func {+new Date()}
            <Input></Input>
        </div>
    );
};

FuncDemo.propTypes = {

};

export default FuncDemo;
