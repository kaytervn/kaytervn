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
    public partial class fThongTinCaNhan : Form
    {
        CongDan cd = new CongDan();
        CanCuocCongDan cccd = new CanCuocCongDan();

        CongDanDAO cdDAO = new CongDanDAO();
        CanCuocCongDanDAO cccdDAO = new CanCuocCongDanDAO();
        ThuongTruDAO ttDAO = new ThuongTruDAO();
        TamTruTamVangDAO tttvDAO = new TamTruTamVangDAO();
        ThueDAO tDAO = new ThueDAO();

        public fThongTinCaNhan(CongDan cd)
        {
            InitializeComponent();
            this.cd = cd;
            cccd = cccdDAO.LayThongTinCanCuocCongDanBangMaCD(cd.MaCD);
        }

        void LoadThongTinCaNhan()
        {
            tbMaCD.Text = cd.MaCD.ToString(); ;
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

            tbTenTK.Text = cd.TenTK;
            tbMatKhau.Text = cd.MatKhau;

            if (cd.LoaiTK == (int)CongDan.enCD.CongDan)
                rbCongDan.Checked = true;
            else
                rbQuanLy.Checked = true;

            tbSoDu.Text = cd.SoDu.ToString();

            if (cd.Hinh != null)
                ptHinh.Image = Image.FromStream(new MemoryStream(cd.Hinh));
            else
                ptHinh.Image = null;
        }

        void LoadThongTinCanCuocCongDan(CanCuocCongDan cccd)
        {
            btCCCD.Text = cccd.CCCD;
            btMaCD.Text = cccd.CongDan.MaCD.ToString();
            btHoTen.Text = cccd.CongDan.HoTen;
            btNgaySinh.Text = cccd.CongDan.NgaySinh.ToString("dd-MM-yyyy");
            btNoiSinh.Text = cccd.CongDan.NoiSinh;

            if (cccd.CongDan.GioiTinh == (int)CongDan.enCD.Nam)
                btGioiTinh.Text = "Nam";
            else
                btGioiTinh.Text = "Nữ";

            btCoGiaTriDen.Text = (cccd.NgayDangKy.AddDays(5475)).ToString("dd-MM-yyyy");
            btNgayDangKy.Text = cccd.NgayDangKy.ToString("dd-MM-yyyy");

            ThuongTru tt = ttDAO.LayThongTinThuongTruBangMaCD(cccd.CongDan.MaCD);
            if (tt != null)
                btThuongTru.Text = String.Format($"Hộ {tt.MaHo.ToString()}, {tt.HoKhau.TinhThanh}, Q/h {tt.HoKhau.QuanHuyen}, P/x {tt.HoKhau.PhuongXa}");
            else
                btThuongTru.Text = "";
        }

        private void fThongTinCaNhan_Load(object sender, EventArgs e)
        {
            LoadThongTinCaNhan();

            if (cccd != null)
            {
                LoadThongTinCanCuocCongDan(cccd);
                dtgvThue.DataSource = tDAO.LayDanhSach(cccd.CCCD);
                CapNhatCellError_Thue();
            }

            dtgvTamTruTamVang.DataSource = tttvDAO.LayDanhSach(cd.MaCD);
            CapNhatCellError_TamTruTamVang();
        }

        private void cbHienMK_CheckedChanged(object sender, EventArgs e)
        {
            if (cbHienMK.Checked == true)
            {
                tbMatKhau.UseSystemPasswordChar = false;
                tbMatKhauMoi.UseSystemPasswordChar = false;
                tbNhapLaiMatKhau.UseSystemPasswordChar = false;
            }
            else
            {
                tbMatKhau.UseSystemPasswordChar = true;
                tbMatKhauMoi.UseSystemPasswordChar = true;
                tbNhapLaiMatKhau.UseSystemPasswordChar = true;
            }
        }

        private void btDoiMK_Click(object sender, EventArgs e)
        {
            try
            {
                if (tbMatKhauMoi.Text.Length < 5 || tbMatKhauMoi.Text != tbNhapLaiMatKhau.Text)
                    MessageBox.Show("Mật khẩu mới không hợp lệ!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                else
                {
                    this.cd.MatKhau = tbMatKhauMoi.Text;
                    cdDAO.Sua(this.cd);
                    LoadThongTinCaNhan();
                    tbMatKhauMoi.Text = "";
                    tbNhapLaiMatKhau.Text = "";
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Đổi mật khẩu thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
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

        private void btLuu_Click(object sender, EventArgs e)
        {
            try
            {
                this.cd.Hinh = cdDAO.ChuyenAnhThanhMangByte(ptHinh);
                cdDAO.Sua(this.cd);
                MessageBox.Show("Lưu ảnh thành công!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show("Lưu ảnh thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void tbTimKiem_TextChanged(object sender, EventArgs e)
        {
            dtgvTamTruTamVang.DataSource = tttvDAO.TimKiem(cd.MaCD, tbTimKiem.Text);
            CapNhatCellError_TamTruTamVang();
        }

        private void btIn_Click(object sender, EventArgs e)
        {
            try
            {
                dtgvTamTruTamVang.CurrentRow.Selected = true;
                TamTruTamVang tttv = new TamTruTamVang(
                    Convert.ToInt32(dtgvTamTruTamVang.SelectedRows[0].Cells[0].Value),
                    Convert.ToInt32(dtgvTamTruTamVang.SelectedRows[0].Cells[1].Value),
                    (int)dtgvTamTruTamVang.SelectedRows[0].Cells[2].Value,
                    (DateTime)dtgvTamTruTamVang.SelectedRows[0].Cells[3].Value
                );

                if (tttv != null)
                {
                    fGiayTamTruTamVang form = new fGiayTamTruTamVang(tttv);
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

        void CapNhatCellError_TamTruTamVang()
        {
            for (int i = 0; i < dtgvTamTruTamVang.Rows.Count; i++)
            {
                DateTime dt;
                DateTime.TryParse(dtgvTamTruTamVang.Rows[i].Cells[8].Value.ToString(), out dt);
                if (dt.AddDays(730).Date < DateTime.Today.Date)
                    dtgvTamTruTamVang.Rows[i].Cells[8].ErrorText = "Đơn đăng ký đã quá hạn 2 năm!";
            }
        }

        void CapNhatCellError_Thue()
        {
            for (int i = 0; i < dtgvThue.Rows.Count; i++)
            {
                DateTime dt;
                DateTime.TryParse(dtgvThue.Rows[i].Cells[7].Value.ToString(), out dt);
                if (dt.AddDays(30).Date < DateTime.Today.Date)
                    dtgvThue.Rows[i].Cells[7].ErrorText = "Tiền thuế đã quá hạn kể từ ngày khai mã số thuế!";
            }
        }

        private void textBox3_TextChanged(object sender, EventArgs e)
        {
            if (cccd != null)
            {
                dtgvThue.DataSource = tDAO.TimKiem(cccd.CCCD, textBox3.Text);
                CapNhatCellError_Thue();
            }
        }

        private void dtgvThue_SelectionChanged(object sender, EventArgs e)
        {
            try
            {
                dtgvThue.CurrentRow.Selected = true;
                Thue t = new Thue(
                    Convert.ToInt32(dtgvThue.SelectedRows[0].Cells[0].Value),
                    dtgvThue.SelectedRows[0].Cells[1].Value.ToString(),
                    Convert.ToDouble(dtgvThue.SelectedRows[0].Cells[2].Value),
                    dtgvThue.SelectedRows[0].Cells[3].Value.ToString(),
                    Convert.ToDouble(dtgvThue.SelectedRows[0].Cells[4].Value),
                    (DateTime)dtgvThue.SelectedRows[0].Cells[5].Value
                );

                btTienThue.Text = (t.ThuNhap * t.MucThue / 100).ToString();
            }
            catch
            {
                btTienThue.Text = "0";
            }
        }

        private void btThanhToan_Click(object sender, EventArgs e)
        {
            try
            {
                dtgvThue.CurrentRow.Selected = true;
                Thue t = tDAO.LayThongTinThueBangMaThue(Convert.ToInt32(dtgvThue.SelectedRows[0].Cells[0].Value));

                if (t == null)
                    throw new Exception();

                if (t.CanCuocCongDan.CongDan.SoDu < Convert.ToDouble(btTienThue.Text))
                {
                    DialogResult dialogResult = MessageBox.Show(
                        "Số dư trong tài khoản không đủ để thực hiện giao dịch này!\n" +
                        "Nếu thực hiện giao dịch thì số dư có thể bị âm. Bạn có chắc chắn muốn thực hiện không?", "Thông báo",
                        MessageBoxButtons.YesNo, MessageBoxIcon.Question
                    );
                    if (dialogResult == DialogResult.Yes)
                    {
                        t.Ngay = t.Ngay.AddDays(30);
                        tDAO.Sua(t);

                        t.CanCuocCongDan.CongDan.SoDu -= Convert.ToDouble(btTienThue.Text);
                        cdDAO.Sua(t.CanCuocCongDan.CongDan);

                        cd.SoDu = t.CanCuocCongDan.CongDan.SoDu;
                        LoadThongTinCaNhan();

                        textBox3_TextChanged(null, null);
                    }
                }
                else
                {
                    t.Ngay = t.Ngay.AddDays(30);
                    tDAO.Sua(t);

                    t.CanCuocCongDan.CongDan.SoDu -= Convert.ToDouble(btTienThue.Text);
                    cdDAO.Sua(t.CanCuocCongDan.CongDan);

                    cd.SoDu = t.CanCuocCongDan.CongDan.SoDu;
                    LoadThongTinCaNhan();

                    MessageBox.Show("Đóng thuế thành công", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Information);

                    textBox3_TextChanged(null, null);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Đóng thuế thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
