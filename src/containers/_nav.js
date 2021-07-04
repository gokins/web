export default [{
    _name: 'CSidebarNav',
    _children: [
        /* {
              _name: 'CSidebarNavItem',
              name: 'Dashboard',
              to: '/dashboard',
              icon: 'cil-speedometer',
              badge: {
                  color: 'primary',
                  text: 'NEW'
              }
          }, */
        {
            _name: 'CSidebarNavTitle',
            _children: ['Gokins']
        },
        {
            _name: 'CSidebarNavItem',
            name: '用户管理',
            to: '/user/list',
            icon: 'cil-drop'
        },
        {
            _name: 'CSidebarNavItem',
            name: '组织',
            to: '/org/list',
            icon: 'cil-drop'
        },
        {
            _name: 'CSidebarNavItem',
            name: '流水线',
            to: '/pipeline/list',
            icon: 'cil-drop'
        },
        {
            _name: 'CSidebarNavItem',
            name: '构建历史',
            to: '/pipelineVersion/list',
            icon: 'cil-drop'
        },
    ]
}]