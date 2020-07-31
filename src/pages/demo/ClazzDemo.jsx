

import React, { PureComponent } from 'react';

import { Input, Tabs } from 'antd'
import { PageContainer } from '@ant-design/pro-layout';

const { TabPane } = Tabs;

export default class ClazzDemo extends PureComponent {
  time = +new Date();

  componentDidMount() {
    console.log('this.time', this.time)
  }

  render() {
    return <PageContainer>
      hello Clazz 这个不会变的 {this.time}<br />
      ⚠️：为什么 Ant 的Demo页面会刷新 不会缓存 ===》 Ant 页面用redux做的，页面卸载 有clear处理 <br />
      企业级应用，如果有业务模块公用的，多页切，切交互性较多复杂的 ==》 建议用 store 方式（mobx，rxjs等），不建议 redux <br />
      如果客户不要求多页切 建议不要用 性能堪忧<br /><br />
      修改Input里的值在多页切下切换Ant.Tab菜单，值不会清除。<br/> 
      <Input></Input>
    </PageContainer>
  }
};
