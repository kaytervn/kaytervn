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

namespace QuanLyCongDanThanhPho
{
    public partial class fKhaiSinh : Form
    {
        CongDanDAO cdDAO = new CongDanDAO();
        KhaiSinhDAO ksDAO = new KhaiSinhDAO();
        KetHonDAO khDAO = new KetHonDAO();
        KhaiSinh ks;

        public fKhaiSinh()
        {
            InitializeComponent();
        }

        public fKhaiSinh(KhaiSinh ks)
        {
            InitializeComponent();
            this.ks = ks;
        }

        void ChonTheoKhaiSinh()
        {
            for (int i = 0; i < dtgvKhaiSinh.Rows.Count; i++)
            {
                if (ks.MaCD == (int)dtgvKhaiSinh.Rows[i].Cells[0].Value)
                {
                    dtgvKhaiSinh.Rows[i].Selected = true;
                    dtgvKhaiSinh_CellClick(null, null);
                }
            }
        }

        private void fKhaiSinh_Load(object sender, EventArgs e)
        {
            tbDanToc.AutoCompleteCustomSource = cdDAO.danToc;
            tbNoiSinh.AutoCompleteCustomSource = cdDAO.tinhThanh;

            cbMaKH.DataSource = khDAO.LayDanhSach();
            cbMaKH.ValueMember = "MaKH";
            cbMaKH.Text = "";

            cbMaCD.DataSource = cdDAO.LayDanhSach();
            cbMaCD.ValueMember = "MaCD";
            cbMaCD.Text = "";

            ResetThongTinRong();
            dtgvKhaiSinh.DataSource = ksDAO.LayDanhSach();

            if (ks != null)
                ChonTheoKhaiSinh();
        }

        void LoadThongTinKetHon(KetHon kh)
        {
            //Thông tin cha
            tbCCCDCha.Text = kh.CanCuocCongDan.CCCD;
            tbMaCDCha.Text = kh.CanCuocCongDan.MaCD.ToString();
            tbHoTenCha.Text = kh.CanCuocCongDan.CongDan.HoTen;
            dtpkNgaySinhCha.Value = kh.CanCuocCongDan.CongDan.NgaySinh;
            tbNoiSinhCha.Text = kh.CanCuocCongDan.CongDan.NoiSinh;

            if (kh.CanCuocCongDan.CongDan.GioiTinh == (int)CongDan.enCD.Nam)
                rbNamCha.Checked = true;
            else
                rbNuCha.Checked = true;

            //Thông tin mẹ
            tbCCCDMe.Text = kh.CanCuocCongDan1.CCCD;
            tbMaCDMe.Text = kh.CanCuocCongDan1.MaCD.ToString();
            tbHoTenMe.Text = kh.CanCuocCongDan1.CongDan.HoTen;
            dtpkNgaySinhMe.Value = kh.CanCuocCongDan1.CongDan.NgaySinh;
            tbNoiSinhMe.Text = kh.CanCuocCongDan1.CongDan.NoiSinh;

            if (kh.CanCuocCongDan1.CongDan.GioiTinh == (int)CongDan.enCD.Nam)
                rbNamMe.Checked = true;
            else
                rbNuMe.Checked = true;
        }

        void ResetThongTinKetHon()
        {
            //Thông tin cha
            tbCCCDCha.Text = "";
            tbMaCDCha.Text = "";
            tbHoTenCha.Text = "";
            dtpkNgaySinhCha.Value = DateTime.Today;
            tbNoiSinhCha.Text = "";
            rbNamCha.Checked = true;

            //Thông tin mẹ
            tbCCCDMe.Text = "";
            tbMaCDMe.Text = "";
            tbHoTenMe.Text = "";
            dtpkNgaySinhMe.Value = DateTime.Today;
            tbNoiSinhMe.Text = "";
            rbNamMe.Checked = true;
        }

        void ResetThongTinRong()
        {
            cbMaCD.Text = "";
            ResetThongTin();
            cbMaKH.Text = "";
            dtpkNgayKhai.Value = DateTime.Today;
        }

        private void cbMaKH_TextChanged(object sender, EventArgs e)
        {
            try
            {
                KetHon kh = khDAO.LayThongTinKetHonBangMaKH(Convert.ToInt32(cbMaKH.Text));

                if (kh != null)
                    LoadThongTinKetHon(kh);
                else
                    throw new Exception();
            }
            catch
            {
                ResetThongTinKetHon();
            }
        }

        private void btDatLai_Click(object sender, EventArgs e)
        {
            ResetThongTinRong();
        }

        private void tbTimKiem_TextChanged(object sender, EventArgs e)
        {
            dtgvKhaiSinh.DataSource = ksDAO.TimKiem(tbTimKiem.Text);
        }

        private void dtgvKhaiSinh_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            cbMaCD.Text = dtgvKhaiSinh.SelectedRows[0].Cells[0].Value.ToString();
            cbMaKH.Text = dtgvKhaiSinh.SelectedRows[0].Cells[5].Value.ToString();
            dtpkNgayKhai.Value = (DateTime)dtgvKhaiSinh.SelectedRows[0].Cells[8].Value;
        }

        private void btThem_Click(object sender, EventArgs e)
        {
            try
            {
                KhaiSinh ks = new KhaiSinh(Convert.ToInt32(cbMaCD.Text), Convert.ToInt32(cbMaKH.Text), DateTime.Today);
                if (ks.CongDan.MaCD == ks.KetHon.CanCuocCongDan.MaCD || ks.CongDan.MaCD == ks.KetHon.CanCuocCongDan1.MaCD)
                    MessageBox.Show("Thông tin không hợp lệ!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                else
                {
                    ksDAO.Them(ks);
                    dtgvKhaiSinh.DataSource = ksDAO.LayDanhSach();
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
                KhaiSinh ks = new KhaiSinh(Convert.ToInt32(cbMaCD.Text), Convert.ToInt32(cbMaKH.Text), dtpkNgayKhai.Value);
                if (ks.CongDan.MaCD == ks.KetHon.CanCuocCongDan.MaCD || ks.CongDan.MaCD == ks.KetHon.CanCuocCongDan1.MaCD)
                    MessageBox.Show("Thông tin không hợp lệ!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                else
                {
                    ksDAO.Sua(ks);
                    dtgvKhaiSinh.DataSource = ksDAO.LayDanhSach();
                    ResetThongTinRong();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Sửa thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btXoa_Click(object sender, EventArgs e)
        {
            try
            {
                KhaiSinh ks = new KhaiSinh(Convert.ToInt32(cbMaCD.Text), Convert.ToInt32(cbMaKH.Text), dtpkNgayKhai.Value);
                DialogResult dialogResult = MessageBox.Show("Bạn có thật sự muốn xóa không?", "Thông báo", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
                if (dialogResult == DialogResult.Yes)
                {
                    ksDAO.Xoa(ks);
                    dtgvKhaiSinh.DataSource = ksDAO.LayDanhSach();
                    ResetThongTinRong();
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
                KhaiSinh ks = ksDAO.LayThongTinKhaiSinhhBangMaCD(Convert.ToInt32(cbMaCD.Text));

                if (ks != null)
                {
                    fGiayKhaiSinh form = new fGiayKhaiSinh(ks);
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

        void LoadThongTin(CongDan cd)
        {
            tbHoTen.Text = cd.HoTen;
            dtpkNgaySinh.Value = cd.NgaySinh;
            tbNoiSinh.Text = cd.NoiSinh;

            if (cd.GioiTinh == (int)CongDan.enCD.Nu)
                rbNu.Checked = true;
            else
                rbNam.Checked = true;

            tbNgheNghiep.Text = cd.NgheNghiep;
            tbDanToc.Text = cd.DanToc;
            tbTonGiao.Text = cd.TonGiao;

            if (cd.TinhTrang == (int)CongDan.enCD.ConSong)
                rbConSong.Checked = true;
            else
                rbQuaDoi.Checked = true;

            if (cd.HonNhan == (int)CongDan.enCD.DocThan)
                rbDocThan.Checked = true;
            else
                rbDaKetHon.Checked = true;

            tbTenTK.Text = cd.TenTK;
            tbMatKhau.Text = cd.MatKhau;

            if (cd.LoaiTK == (int)CongDan.enCD.CongDan)
                rbCongDan.Checked = true;
            else
                rbQuanLy.Checked = true;

            nmSoDu.Value = Convert.ToDecimal(cd.SoDu);

            if (cd.Hinh != null)
                ptHinh.Image = Image.FromStream(new MemoryStream(cd.Hinh));
            else
                ptHinh.Image = null;
        }

        void ResetThongTin()
        {
            tbHoTen.Text = "";
            dtpkNgaySinh.Value = DateTime.Today;
            tbNoiSinh.Text = "";
            rbNam.Checked = true;
            tbNgheNghiep.Text = "";
            tbDanToc.Text = "";
            tbTonGiao.Text = "";
            rbConSong.Checked = true;
            rbDocThan.Checked = true;
            tbTenTK.Text = "";
            tbMatKhau.Text = "";
            rbCongDan.Checked = true;
            nmSoDu.Value = 0;
            ptHinh.Image = null;
        }

        private void tbMaCD_TextChanged(object sender, EventArgs e)
        {
            try
            {
                CongDan cd = cdDAO.LayThongTinCongDanBangMaCD(Convert.ToInt32(cbMaCD.Text));

                if (cd != null)
                    LoadThongTin(cd);
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
