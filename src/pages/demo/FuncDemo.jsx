import React from 'react'; 
import { Input } from 'antd'
const FuncDemo = ({}) => {

    return (
        <div>
            hello func 这个会变 {+new Date()} <br />
            ⚠️：为什么 Ant 的Demo页面会刷新 不会缓存 ===》 Ant 页面用redux做的，页面卸载 有clear处理 <br />
            企业级应用，如果有业务模块公用的，多页切，切交互性较多复杂的 ==》 建议用 store 方式（mobx，rxjs等），不建议 redux <br />
            如果客户不要求多页切 建议不要用 性能堪忧<br /><br />
            修改Input里的值在多页切下切换Ant.Tab菜单，值不会清除。<br/> 
            <Input></Input>
        </div>
    );
};

FuncDemo.propTypes = {

};

export default FuncDemo;
