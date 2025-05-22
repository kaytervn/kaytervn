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
    public partial class fLyHon : Form
    {
        LyHonDAO lhDAO = new LyHonDAO();
        KetHonDAO khDAO = new KetHonDAO();
        ThuongTruDAO ttDAO = new ThuongTruDAO();
        CongDanDAO cdDAO = new CongDanDAO();
        LyHon lh;

        public fLyHon()
        {
            InitializeComponent();
        }

        public fLyHon(LyHon lh)
        {
            InitializeComponent();
            this.lh = lh;
        }

        void ChonTheoLyHon()
        {
            for (int i = 0; i < dtgvLyHon.Rows.Count; i++)
            {
                if (lh.MaKH == (int)dtgvLyHon.Rows[i].Cells[0].Value)
                    dtgvLyHon.Rows[i].Selected = true;
            }
            dtgvLyHon_CellClick(null, null);
        }

        private void fLyHon_Load(object sender, EventArgs e)
        {
            cbMaKH.DataSource = khDAO.LayDanhSach();
            cbMaKH.ValueMember = "MaKH";
            cbMaKH.Text = "";
            dtgvLyHon.DataSource = lhDAO.LayDanhSach();

            if (lh != null)
                ChonTheoLyHon();
        }

        void LoadThongTin(KetHon kh)
        {
            //Load Thông tin chồng
            tbCCCD.Text = kh.CCCDChong;
            tbMaCD.Text = kh.CanCuocCongDan.CongDan.MaCD.ToString();
            tbHoTen.Text = kh.CanCuocCongDan.CongDan.HoTen;
            dtpkNgaySinh.Value = kh.CanCuocCongDan.CongDan.NgaySinh;
            tbNoiSinh.Text = kh.CanCuocCongDan.CongDan.NoiSinh;

            if (kh.CanCuocCongDan.CongDan.GioiTinh == (int)CongDan.enCD.Nam)
                rbNam.Checked = true;
            else
                rbNu.Checked = true;

            if (kh.CanCuocCongDan.CongDan.TinhTrang == (int)CongDan.enCD.ConSong)
                rbConSong.Checked = true;
            else
                rbQuaDoi.Checked = true;

            if (kh.CanCuocCongDan.CongDan.HonNhan == (int)CongDan.enCD.DaKetHon)
                rbDaKetHon.Checked = true;
            else
                rbDocThan.Checked = true;

            ThuongTru tt = ttDAO.LayThongTinThuongTruBangMaCD(kh.CanCuocCongDan.CongDan.MaCD);
            if (tt != null)
            {
                tbThuongTru.Text = tt.MaHo.ToString();
                tbTinhThanh.Text = tt.HoKhau.TinhThanh;
                tbQuanHuyen.Text = tt.HoKhau.QuanHuyen;
                tbPhuongXa.Text = tt.HoKhau.PhuongXa;
            }
            else
            {
                tbThuongTru.Text = "";
                tbTinhThanh.Text = "";
                tbQuanHuyen.Text = "";
                tbPhuongXa.Text = "";
            }

            //LoadThongTinVo
            tbCCCD1.Text = kh.CCCDVo;
            tbMaCD1.Text = kh.CanCuocCongDan1.CongDan.MaCD.ToString();
            tbHoTen1.Text = kh.CanCuocCongDan1.CongDan.HoTen;
            dtpkNgaySinh1.Value = kh.CanCuocCongDan1.CongDan.NgaySinh;
            tbNoiSinh1.Text = kh.CanCuocCongDan1.CongDan.NoiSinh;

            if (kh.CanCuocCongDan1.CongDan.GioiTinh == (int)CongDan.enCD.Nam)
                rbNam1.Checked = true;
            else
                rbNu1.Checked = true;

            if (kh.CanCuocCongDan1.CongDan.TinhTrang == (int)CongDan.enCD.ConSong)
                rbConSong1.Checked = true;
            else
                rbQuaDoi1.Checked = true;

            if (kh.CanCuocCongDan1.CongDan.HonNhan == (int)CongDan.enCD.DaKetHon)
                rbDaKetHon1.Checked = true;
            else
                rbDocThan1.Checked = true;

            ThuongTru tt1 = ttDAO.LayThongTinThuongTruBangMaCD(kh.CanCuocCongDan1.CongDan.MaCD);
            if (tt1 != null)
            {
                tbThuongTru1.Text = tt1.MaHo.ToString();
                tbTinhThanh1.Text = tt1.HoKhau.TinhThanh;
                tbQuanHuyen1.Text = tt1.HoKhau.QuanHuyen;
                tbPhuongXa1.Text = tt1.HoKhau.PhuongXa;
            }
            else
            {
                tbThuongTru1.Text = "";
                tbTinhThanh1.Text = "";
                tbQuanHuyen1.Text = "";
                tbPhuongXa1.Text = "";
            }
        }

        void ResetThongTin()
        {
            tbCCCD.Text = "";
            tbMaCD.Text = "";
            tbHoTen.Text = "";
            dtpkNgaySinh.Value = DateTime.Today;
            tbNoiSinh.Text = "";
            rbNam.Checked = true;
            rbConSong.Checked = true;
            rbDocThan.Checked = true;
            tbThuongTru.Text = "";
            tbTinhThanh.Text = "";
            tbQuanHuyen.Text = "";
            tbPhuongXa.Text = "";

            tbCCCD1.Text = "";
            tbMaCD1.Text = "";
            tbHoTen1.Text = "";
            dtpkNgaySinh1.Value = DateTime.Today;
            tbNoiSinh1.Text = "";
            rbNam1.Checked = true;
            rbConSong1.Checked = true;
            rbDocThan1.Checked = true;
            tbThuongTru1.Text = "";
            tbTinhThanh1.Text = "";
            tbQuanHuyen1.Text = "";
            tbPhuongXa1.Text = "";
        }

        void ResetThongTinRong()
        {
            cbMaKH.Text = "";
            tbLyDo.Text = "";
            dtpkNgayDKLH.Value = DateTime.Today;
        }

        private void dtgvLyHon_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            cbMaKH.Text = dtgvLyHon.SelectedRows[0].Cells[0].Value.ToString();
            tbLyDo.Text = dtgvLyHon.SelectedRows[0].Cells[5].Value.ToString();
            dtpkNgayDKLH.Value = (DateTime)dtgvLyHon.SelectedRows[0].Cells[6].Value;
        }

        private void btDatLai_Click(object sender, EventArgs e)
        {
            ResetThongTinRong();
        }

        private void btXoa_Click(object sender, EventArgs e)
        {
            try
            {
                LyHon lh = new LyHon(Convert.ToInt32(cbMaKH.Text), tbLyDo.Text, dtpkNgayDKLH.Value);

                DialogResult dialogResult = MessageBox.Show("Bạn có thật sự muốn xóa không?", "Thông báo", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
                if (dialogResult == DialogResult.Yes)
                {
                    lhDAO.Xoa(lh);

                    lh.KetHon.CanCuocCongDan.CongDan.HonNhan = (int)CongDan.enCD.DaKetHon;
                    cdDAO.Sua(lh.KetHon.CanCuocCongDan.CongDan);
                    lh.KetHon.CanCuocCongDan1.CongDan.HonNhan = (int)CongDan.enCD.DaKetHon;
                    cdDAO.Sua(lh.KetHon.CanCuocCongDan1.CongDan);

                    dtgvLyHon.DataSource = lhDAO.LayDanhSach();
                    ResetThongTinRong();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Xóa thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btThem_Click(object sender, EventArgs e)
        {
            try
            {
                LyHon lh = new LyHon(Convert.ToInt32(cbMaKH.Text), tbLyDo.Text, DateTime.Today);
                if (lh.LyDo != "")
                {
                    lhDAO.Them(lh);

                    lh.KetHon.CanCuocCongDan.CongDan.HonNhan = (int)CongDan.enCD.DocThan;
                    cdDAO.Sua(lh.KetHon.CanCuocCongDan.CongDan);
                    lh.KetHon.CanCuocCongDan1.CongDan.HonNhan = (int)CongDan.enCD.DocThan;
                    cdDAO.Sua(lh.KetHon.CanCuocCongDan1.CongDan);

                    dtgvLyHon.DataSource = lhDAO.LayDanhSach();
                    ResetThongTinRong();
                }
                else
                    MessageBox.Show("Vui lòng nhập vào lý do ly hôn!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
            catch (Exception ex)
            {
                MessageBox.Show("Thêm thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btIn_Click(object sender, EventArgs e)
        {
            try
            {
                LyHon lh = lhDAO.LayThongTinLyHonBangMaKH(Convert.ToInt32(cbMaKH.Text));
                if (lh != null)
                {
                    fGiayLyHon form = new fGiayLyHon(lh);
                    form.ShowDialog();
                }
                else
                    throw new Exception();
            }
            catch (Exception ex)
            {
                MessageBox.Show("In thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void tbTimKiem_TextChanged(object sender, EventArgs e)
        {
            dtgvLyHon.DataSource = lhDAO.TimKiem(tbTimKiem.Text);
        }

        private void cbMaKH_TextChanged(object sender, EventArgs e)
        {
            try
            {
                KetHon kh = khDAO.LayThongTinKetHonBangMaKH(Convert.ToInt32(cbMaKH.Text));

                if (kh != null)
                    LoadThongTin(kh);
                else
                    throw new Exception();
            }
            catch
            {
                ResetThongTin();
            }
        }
    }
}
