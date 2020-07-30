

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

      <Tabs tabBarExtraContent={<div>abc</div>}>
        <TabPane tab="Tab 1" key="1">
          Content of tab 1
    </TabPane>
        <TabPane tab="Tab 2" key="2">
          Content of tab 2
    </TabPane>
        <TabPane tab="Tab 3" key="3">
          Content of tab 3
    </TabPane>
      </Tabs>
            hello Clazz {this.time}
      <Input></Input>
      </PageContainer>
  }
};
