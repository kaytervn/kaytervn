using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using static QuanLyCongDanThanhPho.CongDan;

namespace QuanLyCongDanThanhPho
{
    public delegate void DataSentCCCD(CanCuocCongDan cccd);
    public delegate void DataSentKhaiSinh(KhaiSinh ks);
    public delegate void DataSentKhaiTu(KhaiTu kt);
    public delegate void DataSentKetHon(KetHon kh);
    public delegate void DataSentLyHon(LyHon lh);
    public delegate void DataSentHoKhau(HoKhau hk, ThuongTru tt);

    public partial class fThongTinCongDan : Form
    {
        public event DataSentCCCD DataSentCCCD;
        public event DataSentKhaiSinh DataSentKhaiSinh;
        public event DataSentKhaiTu DataSentKhaiTu;
        public event DataSentKetHon DataSentKetHon;
        public event DataSentLyHon DataSentLyHon;
        public event DataSentHoKhau DataSentHoKhau;

        CongDan cd = new CongDan();
        CongDanDAO cdDAO = new CongDanDAO();
        CanCuocCongDanDAO cccdDAO = new CanCuocCongDanDAO();
        KhaiSinhDAO ksDAO = new KhaiSinhDAO();
        KhaiTuDAO ktDAO = new KhaiTuDAO();
        KetHonDAO khDAO = new KetHonDAO();
        LyHonDAO lhDAO = new LyHonDAO();
        HoKhauDAO hkDAO = new HoKhauDAO();
        ThuongTruDAO ttDAO = new ThuongTruDAO();

        public fThongTinCongDan(CongDan cd)
        {
            InitializeComponent();
            this.cd = cd;
        }

        bool KiemTraThongTinHopLe(CongDan cd)
        {
            if (cd.HoTen == "" || cd.NgaySinh.Date > DateTime.Today.Date || cd.NoiSinh == "" || cd.DanToc == "" || cd.TonGiao == "" || cd.MatKhau.Length < 5 || cd.TenTK.Length < 5 || cd.TenTK.Contains(" ") || cd.NgheNghiep == "")
                return false;
            return true;
        }

        void ResetMenuStrip()
        {
            cănCướcCôngDânToolStripMenuItem.Enabled = false;
            lyHônToolStripMenuItem.Enabled = false;
            kếtHônToolStripMenuItem.Enabled = false;
            khaiSinhToolStripMenuItem.Enabled = false;
            khaiTửToolStripMenuItem.Enabled = false;
            hộKhẩuToolStripMenuItem.Enabled = false;
        }

        void CheckMenuStrip()
        {
            ResetMenuStrip();
            CanCuocCongDan cccd = cccdDAO.LayThongTinCanCuocCongDanBangMaCD(Convert.ToInt32(tbMaCD.Text));
            if (cccd != null)
            {
                cănCướcCôngDânToolStripMenuItem.Enabled = true;

                KetHon kh = khDAO.LayThongTinKetHonBangCCCD(cccd.CCCD);
                if (kh != null)
                {
                    kếtHônToolStripMenuItem.Enabled = true;

                    LyHon lh = lhDAO.LayThongTinLyHonBangMaKH(kh.MaKH);
                    if (lh != null)
                        lyHônToolStripMenuItem.Enabled = true;
                    else
                        lyHônToolStripMenuItem.Enabled = false;
                }
                else
                    kếtHônToolStripMenuItem.Enabled = false;
            }
            else
                cănCướcCôngDânToolStripMenuItem.Enabled = false;

            KhaiSinh ks = ksDAO.LayThongTinKhaiSinhhBangMaCD(Convert.ToInt32(tbMaCD.Text));
            if (ks != null)
                khaiSinhToolStripMenuItem.Enabled = true;
            else
                khaiSinhToolStripMenuItem.Enabled = false;

            KhaiTu kt = ktDAO.LayThongTinKhaiTuBangMaCD(Convert.ToInt32(tbMaCD.Text));
            if (kt != null)
                khaiTửToolStripMenuItem.Enabled = true;
            else
                khaiTửToolStripMenuItem.Enabled = false;

            try
            {
                ThuongTru tt = ttDAO.LayThongTinThuongTruBangMaCD(Convert.ToInt32(tbMaCD.Text));
                HoKhau hk = hkDAO.LayThongTinHoKhauBangMaHo(tt.MaHo);
                if (hk != null && tt != null)
                    hộKhẩuToolStripMenuItem.Enabled = true;
                else
                    throw new Exception();
            }
            catch
            {
                hộKhẩuToolStripMenuItem.Enabled = false;
            }
        }

        void ResetThongTinRong()
        {
            tbMaCD.Text = "";
            tbHoTen.Text = "";
            dtpkNgaySinh.Value = DateTime.Today;
            tbNoiSinh.Text = "";
            rbNam.Checked = true;
            tbNgheNghiep.Text = "Chưa có";
            tbDanToc.Text = "Kinh";
            tbTonGiao.Text = "Không";
            rbConSong.Checked = true;
            rbDocThan.Checked = true;
            tbTenTK.Text = "";
            tbMatKhau.Text = "";
            rbCongDan.Checked = true;
            nmSoDu.Value = 0;
            ptHinh.Image = null;
            ResetMenuStrip();
        }

        private void fThongTinCongDan_Load(object sender, EventArgs e)
        {
            // TODO: This line of code loads data into the 'congDanDS.CongDan' table. You can move, or remove it, as needed.
            this.congDanTableAdapter.Fill(this.congDanDS.CongDan);
            tbDanToc.AutoCompleteCustomSource = cdDAO.danToc;
            tbNoiSinh.AutoCompleteCustomSource = cdDAO.tinhThanh;
            ResetThongTinRong();
            dtgvThongTinCaNhan.DataSource = cdDAO.LayDanhSach();
        }

        private void dtgvThongTinCaNhan_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            dtgvThongTinCaNhan.CurrentRow.Selected = true;
            tbMaCD.Text = dtgvThongTinCaNhan.SelectedRows[0].Cells[0].Value.ToString();
            tbHoTen.Text = dtgvThongTinCaNhan.SelectedRows[0].Cells[1].Value.ToString();
            dtpkNgaySinh.Value = (DateTime)dtgvThongTinCaNhan.SelectedRows[0].Cells[2].Value;
            tbNoiSinh.Text = dtgvThongTinCaNhan.SelectedRows[0].Cells[3].Value.ToString();

            if ((int)dtgvThongTinCaNhan.SelectedRows[0].Cells[4].Value == (int)CongDan.enCD.Nam)
                rbNam.Checked = true;
            else
                rbNu.Checked = true;

            tbNgheNghiep.Text = dtgvThongTinCaNhan.SelectedRows[0].Cells[5].Value.ToString();
            tbDanToc.Text = dtgvThongTinCaNhan.SelectedRows[0].Cells[6].Value.ToString();
            tbTonGiao.Text = dtgvThongTinCaNhan.SelectedRows[0].Cells[7].Value.ToString();

            if ((int)dtgvThongTinCaNhan.SelectedRows[0].Cells[8].Value == (int)CongDan.enCD.ConSong)
                rbConSong.Checked = true;
            else
                rbQuaDoi.Checked = true;

            if ((int)dtgvThongTinCaNhan.SelectedRows[0].Cells[9].Value == (int)CongDan.enCD.DocThan)
                rbDocThan.Checked = true;
            else
                rbDaKetHon.Checked = true;

            tbTenTK.Text = dtgvThongTinCaNhan.SelectedRows[0].Cells[10].Value.ToString();
            tbMatKhau.Text = dtgvThongTinCaNhan.SelectedRows[0].Cells[11].Value.ToString();

            if ((int)dtgvThongTinCaNhan.SelectedRows[0].Cells[12].Value == (int)CongDan.enCD.CongDan)
                rbCongDan.Checked = true;
            else
                rbQuanLy.Checked = true;

            nmSoDu.Value = Convert.ToDecimal(dtgvThongTinCaNhan.SelectedRows[0].Cells[13].Value);

            if (!Convert.IsDBNull(dtgvThongTinCaNhan.SelectedRows[0].Cells[14].Value))
                ptHinh.Image = Image.FromStream(new MemoryStream((byte[])dtgvThongTinCaNhan.SelectedRows[0].Cells[14].Value));
            else
                ptHinh.Image = null;

            CheckMenuStrip();
        }

        private void btDatLai_Click(object sender, EventArgs e)
        {
            ResetThongTinRong();
        }

        private void btThem_Click(object sender, EventArgs e)
        {
            try
            {
                CongDan cd = new CongDan(
                    0,
                    tbHoTen.Text,
                    dtpkNgaySinh.Value,
                    tbNoiSinh.Text,
                    (rbNam.Checked == true) ? (int)CongDan.enCD.Nam : (int)CongDan.enCD.Nu,
                    tbNgheNghiep.Text,
                    tbDanToc.Text,
                    tbTonGiao.Text,
                    (int)CongDan.enCD.ConSong,
                    (int)CongDan.enCD.DocThan,
                    tbTenTK.Text,
                    tbMatKhau.Text,
                    (rbCongDan.Checked == true) ? (int)CongDan.enCD.CongDan : (int)CongDan.enCD.QuanLy,
                    Convert.ToDouble(nmSoDu.Value),
                    (ptHinh.Image != null) ? cdDAO.ChuyenAnhThanhMangByte(ptHinh) : null
                );
                if (KiemTraThongTinHopLe(cd) == false)
                    MessageBox.Show("Thông tin không hợp lệ!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                else
                {
                    cdDAO.Them(cd);
                    dtgvThongTinCaNhan.DataSource = cdDAO.LayDanhSach();
                    ResetThongTinRong();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Thêm thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btSua_Click(object sender, EventArgs e)
        {
            try
            {
                CongDan cd = new CongDan(
                    Convert.ToInt32(tbMaCD.Text),
                    tbHoTen.Text,
                    dtpkNgaySinh.Value,
                    tbNoiSinh.Text,
                    (rbNam.Checked == true) ? (int)CongDan.enCD.Nam : (int)CongDan.enCD.Nu,
                    tbNgheNghiep.Text,
                    tbDanToc.Text,
                    tbTonGiao.Text,
                    (rbConSong.Checked == true) ? (int)CongDan.enCD.ConSong : (int)CongDan.enCD.QuaDoi,
                    (rbDocThan.Checked == true) ? (int)CongDan.enCD.DocThan : (int)CongDan.enCD.DaKetHon,
                    tbTenTK.Text,
                    tbMatKhau.Text,
                    (rbCongDan.Checked == true) ? (int)CongDan.enCD.CongDan : (int)CongDan.enCD.QuanLy,
                    Convert.ToDouble(nmSoDu.Value),
                    (ptHinh.Image != null) ? cdDAO.ChuyenAnhThanhMangByte(ptHinh) : null
                );
                if (KiemTraThongTinHopLe(cd) == false)
                    MessageBox.Show("Thông tin không hợp lệ!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                else
                {
                    cdDAO.Sua(cd);
                    dtgvThongTinCaNhan.DataSource = cdDAO.LayDanhSach();
                    ResetThongTinRong();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Sửa thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btTaiLen_Click(object sender, EventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog();
            ofd.Title = "Chọn ảnh";
            ofd.Filter = "Image Files(*.gif; *.jpg; *.jpeg; *.bmp; *.wmf; *.png) | *.gif; *.jpg; *.jpeg; *.bmp; *.wmf; *.png";
            if (ofd.ShowDialog() == DialogResult.OK)
                ptHinh.ImageLocation = ofd.FileName;
        }

        private void btXoa_Click(object sender, EventArgs e)
        {
            try
            {
                if (Convert.ToInt32(tbMaCD.Text) == this.cd.MaCD)
                {
                    MessageBox.Show("Không thể xóa bản thân!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
                else
                {
                    CongDan cd = new CongDan(
                        Convert.ToInt32(tbMaCD.Text),
                        tbHoTen.Text,
                        dtpkNgaySinh.Value,
                        tbNoiSinh.Text,
                        (rbNam.Checked == true) ? (int)CongDan.enCD.Nam : (int)CongDan.enCD.Nu,
                        tbNgheNghiep.Text,
                        tbDanToc.Text,
                        tbTonGiao.Text,
                        (rbConSong.Checked == true) ? (int)CongDan.enCD.ConSong : (int)CongDan.enCD.QuaDoi,
                        (rbDocThan.Checked == true) ? (int)CongDan.enCD.DocThan : (int)CongDan.enCD.DaKetHon,
                        tbTenTK.Text,
                        tbMatKhau.Text,
                        (rbCongDan.Checked == true) ? (int)CongDan.enCD.CongDan : (int)CongDan.enCD.QuanLy,
                        Convert.ToDouble(nmSoDu.Value),
                        (ptHinh.Image != null) ? cdDAO.ChuyenAnhThanhMangByte(ptHinh) : null
                    );
                    DialogResult dialogResult = MessageBox.Show("Bạn có thật sự muốn xóa không?", "Thông báo", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
                    if (dialogResult == DialogResult.Yes)
                    {
                        cdDAO.Xoa(cd);
                        dtgvThongTinCaNhan.DataSource = cdDAO.LayDanhSach();
                        ResetThongTinRong();
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Xóa thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btIn_Click(object sender, EventArgs e)
        {
            try
            {
                CongDan cd = cdDAO.LayThongTinCongDanBangMaCD(Convert.ToInt32(tbMaCD.Text));

                fGiayThongTinCaNhan form = new fGiayThongTinCaNhan(cd);
                form.ShowDialog();
            }
            catch (Exception ex)
            {
                MessageBox.Show("In thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void tbTimKiem_TextChanged(object sender, EventArgs e)
        {
            dtgvThongTinCaNhan.DataSource = cdDAO.TimKiem(tbTimKiem.Text);
        }

        private void cănCướcCôngDânToolStripMenuItem_Click(object sender, EventArgs e)
        {
            CanCuocCongDan cccd = cccdDAO.LayThongTinCanCuocCongDanBangMaCD(Convert.ToInt32(tbMaCD.Text));
            this.DataSentCCCD(cccd);
        }

        private void khaiSinhToolStripMenuItem_Click(object sender, EventArgs e)
        {
            KhaiSinh ks = ksDAO.LayThongTinKhaiSinhhBangMaCD(Convert.ToInt32(tbMaCD.Text));
            this.DataSentKhaiSinh(ks);
        }

        private void khaiTửToolStripMenuItem_Click(object sender, EventArgs e)
        {
            KhaiTu kt = ktDAO.LayThongTinKhaiTuBangMaCD(Convert.ToInt32(tbMaCD.Text));
            this.DataSentKhaiTu(kt);
        }

        private void kếtHônToolStripMenuItem_Click(object sender, EventArgs e)
        {
            CanCuocCongDan cccd = cccdDAO.LayThongTinCanCuocCongDanBangMaCD(Convert.ToInt32(tbMaCD.Text));
            KetHon kh = khDAO.LayThongTinKetHonBangCCCD(cccd.CCCD);
            this.DataSentKetHon(kh);
        }

        private void lyHônToolStripMenuItem_Click(object sender, EventArgs e)
        {
            CanCuocCongDan cccd = cccdDAO.LayThongTinCanCuocCongDanBangMaCD(Convert.ToInt32(tbMaCD.Text));
            KetHon kh = khDAO.LayThongTinKetHonBangCCCD(cccd.CCCD);
            LyHon lh = lhDAO.LayThongTinLyHonBangMaKH(kh.MaKH);
            this.DataSentLyHon(lh);
        }

        private void hộKhẩuToolStripMenuItem_Click(object sender, EventArgs e)
        {
            ThuongTru tt = ttDAO.LayThongTinThuongTruBangMaCD(Convert.ToInt32(tbMaCD.Text));
            HoKhau hk = hkDAO.LayThongTinHoKhauBangMaHo(tt.MaHo);
            this.DataSentHoKhau(hk, tt);
        }
    }
}
