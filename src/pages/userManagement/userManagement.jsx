import { DeleteOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Space, Table, Tag } from 'antd'
import { useFormik } from 'formik'
import { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { getUser } from '~/services/trelloAPI.service'
import { deleteUser, editUser } from '~/services/user.service'
import { IIFE } from '~/utils'
import * as Y from 'yup'

const validationSchema = Y.object({
  id: Y.string().required(),
  passWord: Y.string().required(),
  email: Y.string().required().email(),
  name: Y.string().required(),
  phoneNumber: Y.string().required()
})

function UserManagement() {
  const {
    handleSubmit,
    getFieldProps,
    setFieldValue,
    handleChange,
    touched,
    errors,
    initialValues
  } = useFormik({
    initialValues: {
      id: '',
      passWord: '',
      email: '',
      name: '',
      phoneNumber: ''
    },

    validationSchema,

    onSubmit: (values) => {
      const payload = {
        id: values.id,
        passWord: values.passWord,
        email: values.email,
        name: values.name,
        phoneNumber: values.phoneNumber
      }
      //   console.log(payload)
      editUser(payload)
        .then((resp) => {
          alert('Cập nhật User thành công')
          IIFE(async () => {
            const resp = await getUser()
            setUser(resp)
          })
          setIsModalOpen(false)
        })
        .catch((err) => {
          alert('Cập nhật User thất bại')
        })
    }
  })
  const [user, setUser] = useState([])
  const [id, setId] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  useEffect(() => {
    IIFE(async () => {
      const resp = await getUser()
      setUser(resp)
    })
  }, [])

  //   console.log(user)

  //   -------------------------------
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }
  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close
    }) => (
      <div
        style={{
          padding: 8
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block'
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false
              })
              setSearchText(selectedKeys[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })
  const columns2 = [
    {
      title: 'ID',
      dataIndex: 'userId',
      key: 'userId',
      render: (text) => <a>{text}</a>,
      ...getColumnSearchProps('userId')
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email')
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      ...getColumnSearchProps('phone')
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text) => {
        return (
          <div>
            <Button
              type="primary"
              icon={<FormOutlined />}
              className="mx-2"
              onClick={() => {
                showModal()

                // IIFE(async () => {
                //   const resp = await getProjectDetail(text.id)
                //   setProjectDetail(resp)
                // })
                // IIFE(async () => {
                //   const resp = await getProjectCategory(text.id)
                //   setCategory(resp)
                // })
              }}
            />
            <Button
              type="primary"
              icon={<DeleteOutlined />}
              danger
              onClick={() => {
                console.log(text.userId)
                deleteUser(text.userId)
                  .then((resp) => {
                    alert('Xóa user thành công')
                    IIFE(async () => {
                      const resp = await getUser()
                      setUser(resp)
                    })
                  })
                  .catch((err) => {
                    alert('User chưa được xóa')
                  })
                IIFE(async () => {
                  const resp = await getUser()
                  setUser(resp)
                })
              }}
            />
          </div>
        )
      }
    }
  ]
  return (
    <div>
      <Table columns={columns2} dataSource={user} />
      <Modal
        title="Edit user"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <form onSubmit={handleSubmit}>
          <div>
            <p>ID</p>
            <input className="form-control" type="" {...getFieldProps('id')} />
            {touched.id && errors.id && (
              <p className="text-danger">{errors.id}</p>
            )}
          </div>
          <div>
            <p>Email</p>
            <input
              className="form-control"
              type="email"
              {...getFieldProps('email')}
            />
            {touched.email && errors.email && (
              <p className="text-danger">{errors.email}</p>
            )}
          </div>
          <div>
            <p>PassWord</p>
            <input
              className="form-control"
              type="password"
              {...getFieldProps('passWord')}
            />
            {touched.passWord && errors.passWord && (
              <p className="text-danger">{errors.passWord}</p>
            )}
          </div>

          <div>
            <p>Name</p>
            <input
              className="form-control"
              type="text"
              {...getFieldProps('name')}
            />
            {touched.name && errors.name && (
              <p className="text-danger">{errors.name}</p>
            )}
          </div>
          <div>
            <p>Phone</p>
            <input
              className="form-control"
              type="text"
              {...getFieldProps('phoneNumber')}
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <p className="text-danger">{errors.phoneNumber}</p>
            )}
          </div>
          <button className="btn btn-primary mt-4">Edit</button>
        </form>
      </Modal>
    </div>
  )
}

export default UserManagement
