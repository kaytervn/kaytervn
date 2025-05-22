using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyTruongHoc
{
    public partial class fGiaoVien : Form
    {
        GiaoVienDAO gvDAO = new GiaoVienDAO();

        public fGiaoVien()
        {
            InitializeComponent();
        }

        #region Methods
        bool IsEmail(string email)
        {
            try
            {
                MailAddress m = new MailAddress(email);
                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }

        void ReloadGV()
        {
            dtgvGV.DataSource = gvDAO.LayDanhSach();
            ResetTextBox();
        }

        void ResetTextBox()
        {
            tbxMaGV.Text = "";
            tbxTen.Text = "";
            tbxQueQuan.Text = "";
            dtpkNgaySinh.Value = DateTime.Today;
            tbxCMND.Text = "";
            tbxEmail.Text = "";
            tbxSDT.Text = "";
        }

        bool LaDaySoHopLe(string num, int len)
        {
            string condi = "^[0-9]{" + len.ToString() + "}$";
            Regex regex = new Regex(condi);
            return regex.IsMatch(num);
        }

        bool IsInvalidInput(GiaoVien hs)
        {
            return (hs.MaGV == "" || hs.Ten == "" || hs.QueQuan == "" || hs.NgaySinh == "" || LaDaySoHopLe(hs.CMND1, 11) == false || IsEmail(hs.Email) == false || LaDaySoHopLe(hs.SoDT, 10) == false);
        }

        #endregion

        #region Events

        private void fGiaoVien_Load(object sender, EventArgs e)
        {
            ReloadGV();
        }

        private void btnThem_Click(object sender, EventArgs e)
        {
            try
            {
                GiaoVien ob = new GiaoVien(tbxMaGV.Text, tbxTen.Text, tbxQueQuan.Text, dtpkNgaySinh.Text, tbxCMND.Text, tbxEmail.Text, tbxSDT.Text);
                if (IsInvalidInput(ob))
                    MessageBox.Show("Thông tin không hợp lệ");
                else
                {
                    gvDAO.Them(ob);
                    ReloadGV();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Thêm thất bại" + ex);
            }
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            GiaoVien ob = new GiaoVien(tbxMaGV.Text, tbxTen.Text, tbxQueQuan.Text, dtpkNgaySinh.Text, tbxCMND.Text, tbxEmail.Text, tbxSDT.Text);
            gvDAO.Xoa(ob);
            ReloadGV();
        }

        private void btnSua_Click(object sender, EventArgs e)
        {
            try
            {
                GiaoVien ob = new GiaoVien(tbxMaGV.Text, tbxTen.Text, tbxQueQuan.Text, dtpkNgaySinh.Text, tbxCMND.Text, tbxEmail.Text, tbxSDT.Text);
                if (IsInvalidInput(ob))
                    MessageBox.Show("Thông tin không hợp lệ");
                else
                {
                    gvDAO.Sua(ob);
                    ReloadGV();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Thêm thất bại" + ex);
            }
        }

        private void btnXem_Click(object sender, EventArgs e)
        {
            ReloadGV();
        }

        private void dtgvGV_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
            dtgvGV.CurrentRow.Selected = true;
            tbxMaGV.Text = dtgvGV.SelectedRows[0].Cells[0].Value.ToString();
            tbxTen.Text = dtgvGV.SelectedRows[0].Cells[1].Value.ToString();
            tbxQueQuan.Text = dtgvGV.SelectedRows[0].Cells[2].Value.ToString();
            dtpkNgaySinh.Text = dtgvGV.SelectedRows[0].Cells[3].Value.ToString();
            tbxCMND.Text = dtgvGV.SelectedRows[0].Cells[4].Value.ToString();
            tbxEmail.Text = dtgvGV.SelectedRows[0].Cells[5].Value.ToString();
            tbxSDT.Text = dtgvGV.SelectedRows[0].Cells[6].Value.ToString();
        }
        #endregion
    }
}
