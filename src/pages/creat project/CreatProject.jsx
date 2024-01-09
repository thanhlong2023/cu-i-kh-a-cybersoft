import { useEffect, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { useFormik } from 'formik'
import * as Y from 'yup'
import { IIFE } from '~/utils'
import { getProjectCategory } from '~/services'
import { createProjectAuthorize } from '~/services/trelloAPI.service'

const validationSchema = Y.object({
  projectName: Y.string().required(),
  // description: Y.string().required(),
  categoryId: Y.string().required()
})

function CreateProject() {
  const [category, setCategory] = useState([])

  useEffect(() => {
    IIFE(async () => {
      const resp = await getProjectCategory()
      setCategory(resp)
    })
  }, [])

  const editorRef = useRef(null)
  // const log = () => {
  //   if (editorRef.current) {
  //     console.log(editorRef.current.getContent())
  //   }

  // }

  const formik = useFormik({
    initialValues: {
      projectName: '',
      // description: '',
      categoryId: ''
    },

    validationSchema,

    onSubmit: (values) => {
      const payload = {
        projectName: values.projectName,
        description: editorRef.current.getContent(),
        categoryId: values.categoryId
      }
      // console.log(payload)
      createProjectAuthorize(payload)
        .then((resp) => {
          // console.log(resp)
          alert('Tạo dự án thành công')
        })
        .catch((err) => {
          // console.log(err)
          alert('Tạo dự án thất bại')
        })
    }
  })

  return (
    <div className="container">
      <h3>CreateProject</h3>
      <form className="container" onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <p>Name</p>
          <input
            className="form-control"
            {...formik.getFieldProps('projectName')}
          />
          {formik.touched.projectName && formik.errors.projectName && (
            <p className="text-danger">{formik.errors.projectName}</p>
          )}
        </div>
        <div className="form-group">
          <p>Description</p>
          <Editor
            apiKey="m1t8ixpfa9cyy1q5qo75o5bp7m5vz7ddatuasvre9ji00bpa"
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue="<p>Hãy nhập gì đó đi bạn</p>"
            init={{
              height: 300,
              menubar: false,
              plugins: [
                'a11ychecker',
                'advlist',
                'advcode',
                'advtable',
                'autolink',
                'checklist',
                'export',
                'lists',
                'link',
                'image',
                'charmap',
                'preview',
                'anchor',
                'searchreplace',
                'visualblocks',
                'powerpaste',
                'fullscreen',
                'formatpainter',
                'insertdatetime',
                'media',
                'table',
                'help',
                'wordcount'
              ],
              toolbar:
                'undo redo | casechange blocks | bold italic backcolor | ' +
                'alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help',
              content_style:
                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
            // onEditorChange={log}
          />
        </div>
        <div className="form-group">
          <p>Category</p>
          <select
            placeholder="Loại dự án"
            className="form-control"
            {...formik.getFieldProps('categoryId')}
          >
            <option value="">Vui lòng chọn</option>
            {category.map((item, index) => {
              return (
                <option value={item.id} key={index}>
                  {item.projectCategoryName}
                </option>
              )
            })}
          </select>
          {formik.touched.categoryId && formik.errors.categoryId && (
            <p className="text-danger">{formik.errors.categoryId}</p>
          )}
        </div>
        <button className="btn btn-outline-primary mt-4" type="submit">
          Create project
        </button>
      </form>
    </div>
  )
}

export default CreateProject
