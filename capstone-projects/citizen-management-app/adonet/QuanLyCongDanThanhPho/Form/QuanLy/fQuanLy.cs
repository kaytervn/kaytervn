using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyCongDanThanhPho
{
    public partial class fQuanLy : Form
    {
        private Form CurrentFormChild;
        CongDan cd = new CongDan();

        public void OpenChildForm(Form FormChild)
        {
            if (CurrentFormChild != null)
                CurrentFormChild.Close();
            CurrentFormChild = FormChild;
            FormChild.TopLevel = false;
            FormChild.FormBorderStyle = FormBorderStyle.None;
            FormChild.Dock = DockStyle.Fill;
            pnBody.Controls.Add(FormChild);
            pnBody.Tag = FormChild;
            FormChild.BringToFront();
            FormChild.Show();
        }

        public fQuanLy(CongDan cd)
        {
            InitializeComponent();
            this.cd = cd;
        }

        private void fQuanLy_Load(object sender, EventArgs e)
        {
            tbTenNguoiDung.Text = cd.HoTen;
            btThongTinCongDan_Click(sender, e);
        }

        void ResetMauButton()
        {
            btThongTinCongDan.BackColor = Color.WhiteSmoke;
            btCanCuocCongDan.BackColor = Color.WhiteSmoke;
            btKhaiSinh.BackColor = Color.WhiteSmoke;
            btKhaiTu.BackColor = Color.WhiteSmoke;
            btKetHon.BackColor = Color.WhiteSmoke;
            btLyHon.BackColor = Color.WhiteSmoke;
            btHoKhau.BackColor = Color.WhiteSmoke;
            btTamTruTamVang.BackColor = Color.WhiteSmoke;
            btThue.BackColor = Color.WhiteSmoke;
        }

        void DataSentCCCD(CanCuocCongDan cccd)
        {
            btTitle.Text = btCanCuocCongDan.Text.ToUpper();
            ResetMauButton();
            btTitle.BackColor = Color.LightCyan;
            btCanCuocCongDan.BackColor = Color.LightCyan;
            OpenChildForm(new fCanCuocCongDan(cccd));
        }

        void DataSentKhaiSinh(KhaiSinh ks)
        {
            btTitle.Text = btKhaiSinh.Text.ToUpper();
            ResetMauButton();
            btTitle.BackColor = Color.LightGreen;
            btKhaiSinh.BackColor = Color.LightGreen;
            OpenChildForm(new fKhaiSinh(ks));
        }

        void DataSentKhaiTu(KhaiTu kt)
        {
            btTitle.Text = btKhaiTu.Text.ToUpper();
            ResetMauButton();
            btTitle.BackColor = Color.LightSlateGray;
            btKhaiTu.BackColor = Color.LightSlateGray;
            OpenChildForm(new fKhaiTu(cd, kt));
        }

        void DataSentKetHon(KetHon kh)
        {
            btTitle.Text = btKetHon.Text.ToUpper();
            ResetMauButton();
            btTitle.BackColor = Color.Pink;
            btKetHon.BackColor = Color.Pink;
            OpenChildForm(new fKetHon(kh));
        }

        void DataSentLyHon(LyHon lh)
        {
            btTitle.Text = btLyHon.Text.ToUpper();
            ResetMauButton();
            btTitle.BackColor = Color.LightGray;
            btLyHon.BackColor = Color.LightGray;
            OpenChildForm(new fLyHon(lh));
        }

        void DataSentHoKhau(HoKhau hk, ThuongTru tt)
        {
            btTitle.Text = btHoKhau.Text.ToUpper();
            ResetMauButton();
            btTitle.BackColor = Color.LightSeaGreen;
            btHoKhau.BackColor = Color.LightSeaGreen;
            OpenChildForm(new fHoKhau(hk, tt));
        }

        private void btThongTinCongDan_Click(object sender, EventArgs e)
        {
            btTitle.Text = btThongTinCongDan.Text.ToUpper();
            ResetMauButton();
            btTitle.BackColor = Color.LightBlue;
            btThongTinCongDan.BackColor = Color.LightBlue;

            fThongTinCongDan form = new fThongTinCongDan(cd);

            form.DataSentCCCD += DataSentCCCD;
            form.DataSentKhaiSinh += DataSentKhaiSinh;
            form.DataSentKhaiTu += DataSentKhaiTu;
            form.DataSentKetHon += DataSentKetHon;
            form.DataSentLyHon += DataSentLyHon;
            form.DataSentHoKhau += DataSentHoKhau;

            OpenChildForm(form);
        }

        private void đăngXuấtToolStripMenuItem_Click(object sender, EventArgs e)
        {
            DialogResult dialogResult = MessageBox.Show("Bạn có thật sự muốn đăng xuất không?", "Thông báo", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
            if (dialogResult == DialogResult.Yes)
            {
                this.Close();
            }
        }

        private void btCanCuocCongDan_Click(object sender, EventArgs e)
        {
            btTitle.Text = btCanCuocCongDan.Text.ToUpper();
            ResetMauButton();
            btTitle.BackColor = Color.LightCyan;
            btCanCuocCongDan.BackColor = Color.LightCyan;
            OpenChildForm(new fCanCuocCongDan());
        }

        private void btKhaiTu_Click(object sender, EventArgs e)
        {
            btTitle.Text = btKhaiTu.Text.ToUpper();
            ResetMauButton();
            btTitle.BackColor = Color.LightSlateGray;
            btKhaiTu.BackColor = Color.LightSlateGray;
            OpenChildForm(new fKhaiTu(cd));
        }

        private void btKetHon_Click(object sender, EventArgs e)
        {
            btTitle.Text = btKetHon.Text.ToUpper();
            ResetMauButton();
            btTitle.BackColor = Color.Pink;
            btKetHon.BackColor = Color.Pink;
            OpenChildForm(new fKetHon());
        }

        private void btLyHon_Click(object sender, EventArgs e)
        {
            btTitle.Text = btLyHon.Text.ToUpper();
            ResetMauButton();
            btTitle.BackColor = Color.LightGray;
            btLyHon.BackColor = Color.LightGray;
            OpenChildForm(new fLyHon());
        }

        private void btHoKhau_Click(object sender, EventArgs e)
        {
            btTitle.Text = btHoKhau.Text.ToUpper();
            ResetMauButton();
            btTitle.BackColor = Color.LightSeaGreen;
            btHoKhau.BackColor = Color.LightSeaGreen;
            OpenChildForm(new fHoKhau());
        }

        private void btTamTruTamVang_Click(object sender, EventArgs e)
        {
            btTitle.Text = btTamTruTamVang.Text.ToUpper();
            ResetMauButton();
            btTitle.BackColor = Color.LightSalmon;
            btTamTruTamVang.BackColor = Color.LightSalmon;
            OpenChildForm(new fTamTruTamVang());
        }

        private void btThue_Click(object sender, EventArgs e)
        {
            btTitle.Text = btThue.Text.ToUpper();
            ResetMauButton();
            btTitle.BackColor = Color.LightCoral;
            btThue.BackColor = Color.LightCoral;
            OpenChildForm(new fThue());
        }

        private void btKhaiSinh_Click(object sender, EventArgs e)
        {
            btTitle.Text = btKhaiSinh.Text.ToUpper();
            ResetMauButton();
            btTitle.BackColor = Color.LightGreen;
            btKhaiSinh.BackColor = Color.LightGreen;
            OpenChildForm(new fKhaiSinh());
        }
    }
}
