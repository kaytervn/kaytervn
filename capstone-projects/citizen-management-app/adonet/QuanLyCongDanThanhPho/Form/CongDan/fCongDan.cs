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
    public partial class fCongDan : Form
    {
        private Form CurrentFormChild;
        CongDan cd = new CongDan();
        KhaiSinhDAO ksDAO = new KhaiSinhDAO();
        KhaiTuDAO ktDAO = new KhaiTuDAO();
        KetHonDAO khDAO = new KetHonDAO();
        LyHonDAO lhDAO = new LyHonDAO();
        CanCuocCongDanDAO cccdDAO = new CanCuocCongDanDAO();
        ThuongTruDAO ttDAO = new ThuongTruDAO();

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

        public fCongDan(CongDan cd)
        {
            InitializeComponent();
            this.cd = cd;
        }

        private void fCongDan_Load(object sender, EventArgs e)
        {
            tbTenNguoiDung.Text = cd.HoTen;
            btThongTinCaNhan_Click(null, null);
        }

        private void đăngXuấtToolStripMenuItem_Click(object sender, EventArgs e)
        {
            DialogResult dialogResult = MessageBox.Show("Bạn có thật sự muốn đăng xuất không?", "Thông báo", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
            if (dialogResult == DialogResult.Yes)
            {
                this.Close();
            }
        }

        private void btThongTinCaNhan_Click(object sender, EventArgs e)
        {
            btTitle.Text = btThongTinCaNhan.Text.ToUpper();
            btTitle.BackColor = btThongTinCaNhan.BackColor;
            OpenChildForm(new fThongTinCaNhan(cd));
        }

        private void btKhaiSinh_Click(object sender, EventArgs e)
        {
            KhaiSinh ks = ksDAO.LayThongTinKhaiSinhhBangMaCD(cd.MaCD);
            if (ks != null)
            {
                fGiayKhaiSinh form = new fGiayKhaiSinh(ks);
                form.ShowDialog();
            }
            else
                MessageBox.Show("Bạn chưa đăng ký thông tin về giấy tờ này!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }

        private void btKhaiTu_Click(object sender, EventArgs e)
        {
            KhaiTu kt = ktDAO.LayThongTinKhaiTuBangMaCD(cd.MaCD);
            if (kt != null)
            {
                fGiayKhaiTu form = new fGiayKhaiTu(kt);
                form.ShowDialog();
            }
            else
                MessageBox.Show("Bạn chưa đăng ký thông tin về giấy tờ này!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }

        private void btKetHon_Click(object sender, EventArgs e)
        {
            try
            {
                CanCuocCongDan cccd = cccdDAO.LayThongTinCanCuocCongDanBangMaCD(cd.MaCD);
                KetHon kh = khDAO.LayThongTinKetHonBangCCCD(cccd.CCCD);
                if (kh != null)
                {
                    fGiayKetHon form = new fGiayKetHon(kh);
                    form.ShowDialog();
                }
                else
                    throw new Exception();
            }
            catch
            {
                MessageBox.Show("Bạn chưa đăng ký thông tin về giấy tờ này!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }

        private void btLyHon_Click(object sender, EventArgs e)
        {
            try
            {
                CanCuocCongDan cccd = cccdDAO.LayThongTinCanCuocCongDanBangMaCD(cd.MaCD);
                KetHon kh = khDAO.LayThongTinKetHonBangCCCD(cccd.CCCD);
                LyHon lh = lhDAO.LayThongTinLyHonBangMaKH(kh.MaKH);

                if (lh != null)
                {
                    fGiayLyHon form = new fGiayLyHon(lh);
                    form.ShowDialog();
                }
                else
                    throw new Exception();
            }
            catch
            {
                MessageBox.Show("Bạn chưa đăng ký thông tin về giấy tờ này!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }

        private void btHoKhau_Click(object sender, EventArgs e)
        {
            btTitle.Text = btHoKhau.Text.ToUpper();
            btTitle.BackColor = btHoKhau.BackColor;
            ThuongTru tt = ttDAO.LayThongTinThuongTruBangMaCD(cd.MaCD);

            if (tt != null)
            {
                OpenChildForm(new fThuongTru(cd));
            }
            else
                MessageBox.Show("Bạn chưa đăng ký thông tin về giấy tờ này!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }
    }
}
