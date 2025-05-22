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
    public partial class fHocSinh : Form
    {
        HocSinhDAO hsDAO = new HocSinhDAO();

        public fHocSinh()
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
            dtgvHS.DataSource = hsDAO.LayDanhSach();
            ResetTextBox();
        }

        void ResetTextBox()
        {
            tbxMaHS.Text = "";
            tbxTen.Text = "";
            tbxQueQuan.Text = "";
            dtpkNgaySinh.Value = DateTime.Today;
            tbxCMND.Text = "";
            tbxEmail.Text = "";
            tbxSDT.Text = "";
            tbxDiem.Text = "0";
        }

        bool LaDiemHopLe(double diem)
        {
            return diem >= 0 && diem <= 10;
        }

        bool LaDaySoHopLe(string num, int len)
        {
            string condi = "^[0-9]{" + len.ToString() + "}$";
            Regex regex = new Regex(condi);
            return regex.IsMatch(num);
        }

        bool IsInvalidInput(HocSinh hs)
        {
            return (hs.MaHS == "" || hs.Ten == "" || hs.QueQuan == "" || hs.NgaySinh == "" || LaDaySoHopLe(hs.CMND1, 11) == false || IsEmail(hs.Email) == false || LaDaySoHopLe(hs.SoDT, 10) == false || LaDiemHopLe(hs.Diem) == false);
        }

        #endregion

        #region Events
        private void fHocSinh_Load(object sender, EventArgs e)
        {
            ReloadGV();
        }

        private void dtgvHS_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
            dtgvHS.CurrentRow.Selected = true;
            tbxMaHS.Text = dtgvHS.SelectedRows[0].Cells[0].Value.ToString();
            tbxTen.Text = dtgvHS.SelectedRows[0].Cells[1].Value.ToString();
            tbxQueQuan.Text = dtgvHS.SelectedRows[0].Cells[2].Value.ToString();
            dtpkNgaySinh.Text = dtgvHS.SelectedRows[0].Cells[3].Value.ToString();
            tbxCMND.Text = dtgvHS.SelectedRows[0].Cells[4].Value.ToString();
            tbxEmail.Text = dtgvHS.SelectedRows[0].Cells[5].Value.ToString();
            tbxSDT.Text = dtgvHS.SelectedRows[0].Cells[6].Value.ToString();
            tbxDiem.Text = dtgvHS.SelectedRows[0].Cells[7].Value.ToString();
        }

        private void btnThem_Click(object sender, EventArgs e)
        {
            try
            {
                HocSinh ob = new HocSinh(tbxMaHS.Text, tbxTen.Text, tbxQueQuan.Text, dtpkNgaySinh.Text, tbxCMND.Text, tbxEmail.Text, tbxSDT.Text, Convert.ToDouble(tbxDiem.Text));
                if (IsInvalidInput(ob))
                    MessageBox.Show("Thông tin không hợp lệ");
                else
                {
                    hsDAO.Them(ob);
                    ReloadGV();
                }
            }
            catch(Exception ex)
            {
                MessageBox.Show("Thêm thất bại" + ex);
            }
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            HocSinh ob = new HocSinh(tbxMaHS.Text, tbxTen.Text, tbxQueQuan.Text, dtpkNgaySinh.Text, tbxCMND.Text, tbxEmail.Text, tbxSDT.Text, Convert.ToDouble(tbxDiem.Text));
            hsDAO.Xoa(ob);
            ReloadGV();
        }

        private void btnSua_Click(object sender, EventArgs e)
        {
            try
            {
                HocSinh ob = new HocSinh(tbxMaHS.Text, tbxTen.Text, tbxQueQuan.Text, dtpkNgaySinh.Text, tbxCMND.Text, tbxEmail.Text, tbxSDT.Text, Convert.ToDouble(tbxDiem.Text));
                if (IsInvalidInput(ob))
                    MessageBox.Show("Thông tin không hợp lệ");
                else
                {
                    hsDAO.Sua(ob);
                    ReloadGV();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Thất bại" + ex);
            }
        }

        private void btnXem_Click(object sender, EventArgs e)
        {
            ReloadGV();
        }

        private void btnDiemGioi_Click(object sender, EventArgs e)
        {
            HocSinh ob = new HocSinh(tbxMaHS.Text, tbxTen.Text, tbxQueQuan.Text, dtpkNgaySinh.Text, tbxCMND.Text, tbxEmail.Text, tbxSDT.Text, Convert.ToDouble(tbxDiem.Text));
            dtgvHS.DataSource = hsDAO.TimKiemTheoDiemGioi(ob);
        }

        private void btnDiemKha_Click(object sender, EventArgs e)
        {
            HocSinh ob = new HocSinh(tbxMaHS.Text, tbxTen.Text, tbxQueQuan.Text, dtpkNgaySinh.Text, tbxCMND.Text, tbxEmail.Text, tbxSDT.Text, Convert.ToDouble(tbxDiem.Text));
            dtgvHS.DataSource = hsDAO.TimKiemTheoDiemKha(ob);
        }

        private void BtnDiemTB_Click(object sender, EventArgs e)
        {
            HocSinh ob = new HocSinh(tbxMaHS.Text, tbxTen.Text, tbxQueQuan.Text, dtpkNgaySinh.Text, tbxCMND.Text, tbxEmail.Text, tbxSDT.Text, Convert.ToDouble(tbxDiem.Text));
            dtgvHS.DataSource = hsDAO.TimKiemTheoDiemTB(ob);
        }
        #endregion
    }
}
