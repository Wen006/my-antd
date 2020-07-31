/**
 * 菜单多页切
 */
import { connect } from 'dva';
import { Router, withRouter, formatMessage,history, Link } from 'umi';
import React, { Component,useEffect,useState, Fragment } from 'react';
import { message, Tabs, Menu, Dropdown, Tooltip, Icon, Input, Button, Skeleton } from 'antd';
import DraggableTabs from './DraggableTabs';
import { matchPath } from 'umi';
import { SettingOutlined, RetweetOutlined, MailOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;
import styles from './index.less'

const MenuPanel = ({ pane = {}, pages = [], refresh = () => { }, closeTabs = () => { }, switchTab }) => {
  pane = typeof pane == "function" ? pane() : pane;
  const { key, title } = pane
  let leftDisabled = false;
  let rightDisabled = false;

  const pgContent = pages.map((item,index)=>{
    if (item.key === key) {
      if (index > pages.length - 2) {
        rightDisabled = true;
      }
      if (index === 0) {
        leftDisabled = true;
      }
    }
    return <Menu.Item onClick={()=>{switchTab(item.key||item.path||item.url)}} key={item.key||item.path||item.url}>{item.title||item.name}</Menu.Item>
  })

  const isTool = !!switchTab;

  return (
    <Menu className={styles.tabMenu}>
      <Menu.Item
        // onContextMenu={preventDefault}
        onClick={() => {
          refresh();
        }}
      >
        <span title={`刷新-${title}`}>
          <Icon type="reload" />
          刷新当前页面
        </span>
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          window.location.reload(true);
        }}
      >
        <span title="强制刷新浏览器">
          <Icon type="reload" />
          刷新浏览器
        </span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        disabled={pages.length <= 1}
        // onContextMenu={preventDefault}
        onClick={() => {
          closeTabs(key);
        }}
      >
        <Icon type="close-circle" />
        关闭其他标签页
      </Menu.Item>
      <Menu.Item
        disabled={pages.length <= 1 || rightDisabled}
        // onContextMenu={preventDefault}
        onClick={() => {

          closeTabs(key, 'right');
        }}
      >
        <Icon type="close-circle" />
        关闭右侧标签页
      </Menu.Item>
      <Menu.Item
        disabled={pages.length <= 1 || leftDisabled}
        // onContextMenu={preventDefault}
        onClick={() => {
          closeTabs(key, 'left');
        }}
      >
        <Icon type="close-circle" />
        关闭左侧标签页
      </Menu.Item>
      {isTool&&
        <Menu.SubMenu key="menu-sub" title="切换标签">
          {pgContent}
        </Menu.SubMenu>
      }
    </Menu>
  );
};

// 内容loading
const TabLoad = ({children,...other}) =>{
  const [state, setState] = useState(true)
  useEffect(() => { // React16 hooks
      const timer = setTimeout(()=>{
          setState(false)
      },1000); // 延迟一下效果更好
      return () => {
          if(timer){
            clearTimeout(timer)
          }
      }
  }, []);
  // 统一loading效果  下面通过样式可以达到占位子的同时进行资源加载
  return <div {...other}>
    {state?<Skeleton active/>:""}
    <span className={state?styles.hidden:""}>
      {children}
    </span>
  </div> 
}

@withRouter
export default class TabLayout extends Component {

  routes = [];

  state = { pages: [], keys: {} };

  loaded = false;

  flatMenus = {};

  componentDidMount() {

    const { children: routeChild,menuData,routes } = this.props
    // children is switch format menu
    if (routeChild.props) {
      const { children } = routeChild.props
      this.routes = children;
    }

    this.flatMenuInfo(menuData);
    this.flatMenuInfo(routes);
    this.renderHome();
  }

  // 格式化菜单名称 用于多页切标题
  flatMenuInfo = (arr,isMenu) =>{
      arr.forEach((item) => {
        if (!item) {
            return;
        }
        const {path,locale,name} = item;

        if(this.flatMenus[item.path || item.key || '/']){
          if(isMenu){
            this.flatMenus[item.path || item.key || '/'].name = name;
          }
        }else{
          this.flatMenus[item.path || item.key || '/'] = { path,locale,name };
        }
        if (item.children) {
            this.flatMenuInfo(item.children);
        }
    });
  }

  /**
   * 获取菜单标题，优先级如下
   * 1. url请求的query.pageName
   * 2. 菜单配置的name
   * 3. 路由配置的name和locale
   * 4. 由面包屑匹配的菜单（就是 LayoutPro 匹配逻辑）
   * query.pageName ==> menu.name ==> route.name || route.locale ==> 面包屑匹配名称
   * @param {通过path获取菜单名称} path 
   */
  getTabTitle = (path) =>{
    const { location:{query={}}, pageTitleInfo:{pageName} } = this.props;
    const { pageName: queryPageName } = query
    const { name,locale } = this.flatMenus[path];
    return queryPageName || name || (locale&&formatMessage({id:locale})) || pageName;
  }

  // 页面刷新跳回首页
  renderHome = () => {
    if (this.routes.length > 0) {
      const keyId = this.routes[0].props.to; 
      const { element, match, title } = this.matchRoute(keyId); 
      // 说明新添的页面
      const home = { key: keyId, title, content: React.cloneElement(element, { location, computedMatch: match }) };
      const keys = { [`${keyId}`]: { key: keyId, title, match } };

      this.setState({
        pages: [home],
        keys,
        activeKey: keyId
      });
      history.push(keyId)
    }
  }

  // 路由匹配
  matchRoute = (pathname) => {
    let element, match;
    // We use React.Children.forEach instead of React.Children.toArray().find()
    // here because toArray adds keys to all child elements and we do not want
    // to trigger an unmount/remount for two <Route>s that render the same
    // component at different URLs.
    React.Children.forEach(this.routes, child => {
      if (match == null && React.isValidElement(child)) {
        element = child;
        const path = child.props.path || child.props.from;
        match = path
          ? matchPath(pathname, { ...child.props, path })
          : null;
      }
    });
    return {
      element,
      match,
      title:this.getTabTitle(pathname)
    }
  }

  renderChild = () => {
    const { location } = this.props;
    let { pathname } = location;
    const { pages, keys, activeKey } = this.state

    let keyId = pathname;

    const { element, match,title } = this.matchRoute(pathname);

    // 找不到页面 报错404
    if (!match) {
      return this.setState((pState) => {
        if (!keys[keyId]) {
          pState.pages.push({ key: keyId, title, content: React.createElement('div', {}, '未找到') });
          pState.keys[keyId] = { key: keyId, title };
        }
        return {
          ...pState,
          activeKey: keyId
        }
      })
    }

    // 当前存在的页面 就不用处理
    if (keys[keyId]) {
      if (keyId != activeKey) {
        history.push(keyId)
        this.setState({
          activeKey: keyId
        })
      }
      return false;
    }

    // 说明新添的页面
    pages.push({ key: keyId, title, content: React.cloneElement(element, { location, computedMatch: match }) });
    keys[keyId] = { key: keyId, title, match };
    this.setState({
      pages,
      keys,
      activeKey: keyId
    })
  }

  componentDidUpdate(preProps) {
    const { pathname, pageName } = this.props.location;
    if (pathname !== preProps.location.pathname) {
      // 当路由发生改变时，显示相应tab页面
      this.renderChild();
    }
  }

  /**
   * 刷新页面
   * @param {*} key 
   */
  refresh = (key) => {
    key = key || this.state.activeKey;
    const { keys } = this.state;
    keys[key] = { ...keys[key], keyId: Date.now() };
    this.setState({ keys }, () => {
      message.success('页面已经刷新');
    });
  }

  /**
   * 切换tab
   * @param {path} key 
   */
  switchTab = (key) =>{
    // this.setState({activeKey:key})
    history.push(key); // 不用这个antd 的demo不行
  }

  onEdit = targetKey => {
    /**
     * 参照chrome标签页操作，如果关闭当前页的话：
     * 1. 关闭中间某一标签页，选中该页后一页；
     * 2. 关闭最后一页标签页，选中该页前一页；
     * 3. 仅剩一页时不能删除
     */
    const { pages = [], keys } = this.state;
    let { activeKey } = this.state;
    let index = null;
    index = pages.findIndex(page => page.key === targetKey);
    if (activeKey === targetKey) {
      const len = pages.length;
      if (index === len - 1) {
        activeKey = pages[len - 2].key;
      } else {
        activeKey = pages[index + 1].key;
      }
    }
    let keyId = pages[index].key;
    pages.splice(index, 1);
    if (keys[keyId]) {
      delete keys[keyId]
    }
    this.setState({ pages, keys }, () => {
      history.push(activeKey);
    });
  };

  // 关闭tab
  closeTabs = (key, direction) => {
    const { pages, keys } = this.state;
    if (pages.length <= 1) {
      return;
    }
    let cIndex = 0;
    let newKeys = {};
    const newPages = pages
      .map((item, index) => {
        if (item.key === key) {
          cIndex = index;
        }
        return item;
      })
      .map((item, index) => {
        if (direction === 'left') {
          if (index < cIndex) {
            return undefined;
          }
        } else if (direction === 'right') {
          if (index > cIndex) {
            return undefined;
          }
        } else if (item.key !== key) {
          return undefined;
        }
        return item;
      })
      .filter(item => {
        if (item && keys[item.key]) {
          newKeys[item.key] = keys[item.key];
          return true;
        }
        return false;
      });

    this.setState({ pages: newPages, keys: newKeys });
  }

  render() {
    const { pages = [], activeKey, keys } = this.state;

    return (
      <div>
        <DraggableTabs
          hideAdd
          activeKey={activeKey}
          type="editable-card"
          onEdit={this.onEdit}
          onTabClick={ev => {
            history.push(ev);
          }}
          tabBarExtraContent={
            <div>
              <Tooltip title="刷新当前页">
                <Button size="small" onClick={() => this.refresh()} shape="circle" icon={<RetweetOutlined />} />
              </Tooltip>
              <Dropdown overlay={<MenuPanel
                // pane={pages[activeKey]||{title:"ss"}}
                pane={() => {
                  return keys[activeKey] || {};
                }}
                switchTab={this.switchTab}
                pages={pages}
                closeTabs={this.closeTabs}
                refresh={() => {
                  this.refresh();
                }}
              />} placement="bottomCenter" arrow>
                <Button size="small" shape="circle" icon={<SettingOutlined />} />
              </Dropdown>
            </div>
          }
        >
          {pages.map(pane => {
            return (
              <TabPane
                forceRender={false}
                tab={
                  <Dropdown
                    trigger={['contextMenu']}
                    overlay={
                      <MenuPanel
                        pane={pane}
                        pages={pages}
                        closeTabs={this.closeTabs}
                        refresh={() => {
                          this.refresh(pane.key);
                        }}
                      />
                    }
                  >
                    <Tooltip overlayStyle={{ maxWidth: 380, top: 20 }} title={this.tipsTitle}>
                      <span
                        style={{ display: 'inline-block' }}
                        onDoubleClick={() => {

                          this.refresh(pane.key);
                        }}
                      >
                        {pane.title}
                      </span>
                    </Tooltip>
                  </Dropdown>
                }
                key={pane.key}
                closable={pages.length > 1}
                style={{ paddingLeft: 0, paddingRight: 0 }}
              >
                <TabLoad keyId={keys[pane.key].keyId} key={keys[pane.key].keyId} className={styles.main}>
                  {pane.content}
                </TabLoad>
              </TabPane>
            );
          })}
        </DraggableTabs>
      </div>
    );
  }
}
