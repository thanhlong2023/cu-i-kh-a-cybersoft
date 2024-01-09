import { Menu } from 'antd'
import { useNavigate } from 'react-router-dom'
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type
  }
}
const items = [
  getItem(
    'Các không gian làm việc',
    'grp',
    null,
    [
      getItem('Create Task', 'task'),
      getItem('Project management', ''),
      getItem('Create Project', 'creat'),
      getItem('User management', 'user')
    ],
    'group'
  )
]
const SideBar = () => {
  const navigate = useNavigate()
  const onClick = (e) => {
    navigate(`${e.key}`)
  }
  return (
    <Menu
      onClick={onClick}
      style={{
        width: 200,
        fontSize: '16px',
        position: 'fixed',
        top: '70px'
      }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
  )
}
export default SideBar
