import React, { Fragment, useEffect, useState } from "react";
import "../../../assets/scss/User.scss";
import EditUserModal from "./EditUser/EditUserModal";
// import EditModal from "../EditUserModal/EditUserModal";
import { quanLyNguoiDungService } from "../../../Services/QuanLyNguoiDung";
import ModalUser from "./ModalUser";



import swal from "sweetalert";

export default function User() {

  const [state,setState] = useState({
    listNguoiDung: []
  })
 console.log(state.listNguoiDung);
  useEffect(() => {
      quanLyNguoiDungService
      .layDanhSachNguoiDung()
      .then((res) => {
        setState(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);

  const renderDanhSachNguoiDung = () => {
    return state.listNguoiDung?.map((user, index) => {
      return (
        <tr key={user.taiKhoan} className="user-item">
          <td>{index + 1}</td>
          <td>{user.taiKhoan}</td>
          <td>{user.hoTen}</td>
          <td>{user.email}</td>
          <td>{user.soDt}</td>
          <td>{user.maLoaiNguoiDung}</td>
          <td style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="edit-action">
              <i
                className="fa fa-user-edit"
                data-toggle="modal"
                data-target={`#d1${user.taiKhoan}`}
              ></i>
            </div>
            <div
              className="delete-action"
              onClick={() => {
                swal({
                  title: "Bạn chắc chứ?",
                  text: `Xoá ${user.taiKhoan}`,
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then((willDelete) => {
                  if (willDelete) {
                    xoaNguoiDung(user.taiKhoan);
                  }
                });
              }}
            >
              <i className="fa fa-trash-alt"></i>
            </div>
          </td>
          <EditUserModal user={user} />
        </tr>
      );
    });
  };

  const xoaNguoiDung = (taiKhoan) => {
    quanLyNguoiDungService
      .xoaNguoiDung(taiKhoan)
      .then((res) => {
        swal({
          title: `Xóa ${taiKhoan} thành công`,
          icon: "success",
          button: "OK",
        });
       quanLyNguoiDungService
          .layDanhSachNguoiDung()
          .then((res) => {
            setState(res.data);
          })
          .catch((err) => {
            console.log(err.response.data);
          });
      })
      .catch((err) => {
        swal({
          title: err.response.data,
          text: "Xóa không thành công!",
          icon: "warning",
          button: "OK",
        });
      });
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [danhSachNguoiDung, setDanhSachNguoiDung] = useState([]);
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  

  

  useEffect(async () =>{
    try {
      let result = await quanLyNguoiDungService.layDanhSachNguoiDung();

      setState({
        ...state,
       listNguoiDung: result.data.content
      })
    
    } catch (error) {
      console.log("error",error);
    }
},[])


  return (
    <Fragment>
      <div className="title">
        <h2>Danh sách người dùng</h2>
        <button className="btnAdd" data-toggle="modal" data-target="#UserModal">
          <i className="fa fa-plus"></i>
        </button>
        <div className="search">
          <div id="wrap">
            <form autoComplete="on">
              <input
                id="search"
                name="search"
                type="text"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Nhập tên tài khoản cần tìm"
              />
              <input
                id="search_submit"
                defaultValue="Rechercher"
                type="submit"
              />
            </form>
          </div>
        </div>
      </div>
      <div className="table-responsive-sm">
        <table className="table table-sm table-hover table-bordered">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tài khoản</th>
              <th scope="col">Họ Tên</th>
              <th scope="col">Email</th>
              <th scope="col">Số ĐT</th>
              <th scope="col">Người dùng</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>{renderDanhSachNguoiDung()}</tbody>
        </table>
      </div>
      <ModalUser />
    </Fragment>
  );
}
