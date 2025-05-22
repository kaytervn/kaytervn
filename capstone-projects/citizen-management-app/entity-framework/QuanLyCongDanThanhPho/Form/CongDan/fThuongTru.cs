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
    public partial class fThuongTru : Form
    {
        CongDan cd;
        ThuongTru tt;
        HoKhau hk;

        ThuongTruDAO ttDAO = new ThuongTruDAO();
        HoKhauDAO hkDAO = new HoKhauDAO();
        CongDanDAO cdDAO = new CongDanDAO();

        public fThuongTru(CongDan cd)
        {
            InitializeComponent();
            this.cd = cd;
            tt = ttDAO.LayThongTinThuongTruBangMaCD(cd.MaCD);
            hk = hkDAO.LayThongTinHoKhauBangMaHo(tt.MaHo);
        }

        void LoadThongTinHoKhau()
        {
            //Hộ khẩu
            tbMaHo.Text = hk.MaHo.ToString();
            tbChuHo.Text = hk.ChuHo;
            tbTinhThanh.Text = hk.TinhThanh;
            tbQuanHuyen.Text = hk.QuanHuyen;
            tbPhuongXa.Text = hk.PhuongXa;
            dtpkNgayDangKy.Value = hk.NgayDangKy;

            //Chủ hộ
            CongDan cd = hk.CanCuocCongDan.CongDan;
            tbMaCDCH.Text = cd.MaCD.ToString();
            tbHoTenCH.Text = cd.HoTen;
            dtpkNgaySinhCH.Value = cd.NgaySinh;
            tbNoiSinhCH.Text = cd.NoiSinh;

            if (cd.GioiTinh == (int)CongDan.enCD.Nam)
                rbNamCH.Checked = true;
            else
                rbNuCH.Checked = true;

            if (cd.TinhTrang == (int)CongDan.enCD.ConSong)
                rbConSongCH.Checked = true;
            else
                rbQuaDoiCH.Checked = true;
        }

        private void fThuongTru_Load(object sender, EventArgs e)
        {
            // TODO: This line of code loads data into the 'thuongTruDS.vThuongTru' table. You can move, or remove it, as needed.
            this.vThuongTruTableAdapter.Fill(this.thuongTruDS.vThuongTru);
            LoadThongTinHoKhau();
            dtgvThuongTru.DataSource = ttDAO.LayDanhSach(hk.MaHo);
            dtgvThuongTru_CellClick(null, null);
        }

        private void dtgvThuongTru_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            dtgvThuongTru.CurrentRow.Selected = true;
            tbMaCD.Text = dtgvThuongTru.SelectedRows[0].Cells[1].Value.ToString();
            tbMaHo.Text = dtgvThuongTru.SelectedRows[0].Cells[0].Value.ToString();
            tbQHVCH.Text = dtgvThuongTru.SelectedRows[0].Cells[6].Value.ToString();
            dtpkNgayDangKyTT.Value = (DateTime)dtgvThuongTru.SelectedRows[0].Cells[7].Value;

            CongDan cd = cdDAO.LayThongTinCongDanBangMaCD(Convert.ToInt32(tbMaCD.Text));
            LoadThongTin_CongDan(cd);
        }

        private void tbTimKiemTT_TextChanged(object sender, EventArgs e)
        {
            dtgvThuongTru.DataSource = ttDAO.TimKiem(hk.MaHo, tbTimKiemTT.Text);
        }

        void LoadThongTin_CongDan(CongDan cd)
        {
            tbHoTen.Text = cd.HoTen;
            dtpkNgaySinh.Value = cd.NgaySinh;
            tbNoiSinh.Text = cd.NoiSinh;

            if (cd.GioiTinh == (int)CongDan.enCD.Nam)
                rbNam.Checked = true;
            else
                rbNu.Checked = true;

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
        }
    }
}
