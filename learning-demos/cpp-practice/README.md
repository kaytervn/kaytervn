<h1 align="center">C++ Practice</h1>

This repository is used to store C++ source code programmed in the DevCpp environment for my coursework related to algorithms from university subjects.

| Subject                               |                               Directory                               |
| ------------------------------------- | :-------------------------------------------------------------------: |
| Introduction to Programming           | [DIR](https://github.com/kaytervn/Cpp-Practice/tree/main/NMLT-Baitap) |
| Programming Techniques                | [DIR](https://github.com/kaytervn/Cpp-Practice/tree/main/KTLT-Baitap) |
| Data Structures and Algorithms        |   [DIR](https://github.com/kaytervn/Cpp-Practice/tree/main/CTDLGT)    |
| Discrete Mathematics and Graph Theory |  [DIR](https://github.com/kaytervn/Cpp-Practice/tree/main/TRR-LTDT)   |

<h1>Ghi chú</h1>

<h2>Làm tròn</h2>

```c
#include<cmath>
roundf(kq*100)/100; // Lam tron den STP thu 2
roundf(kq*1000)/1000; // Lam tron den STP thu 3
```

<h2>Làm tròn 0.5</h2>

```c
int lamTron(double a)
{
	int h;
		if ((a-int(a))>=0.5)
			h=int(a)+1;
		else h=int(a);
	return h;
}
```

<h1>Thao tác chuỗi</h1>

<h2>Nối chuỗi</h2>

```c
c=a+b;
```

<h2>Nối chuỗi (tại vị trí chỉ định)</h2>

```c
s.insert(position, string);
```

<h2>So sánh</h2>

```c
s1.compare(s2);
```

<h2>Hoán đổi chuỗi</h2>

```c
s1.swap(s2);
```

<h2>Tìm vị trí chuỗi con</h2>

```c
s1.find(s1);
```

<h2>Thay thế tại vị trí chỉ định</h2>

```c
s.replace(position, amount, string);
```

<h2>Xóa các ký tự trong phạm vi chỉ định</h2>

```c
a.erase(position, amount);
```

<h2>Tách chuỗi</h2>

```c
b=substr.a(position, amount);
```

<h2>Tách từng từ trong chuỗi (phân biệt bởi dấu cách)</h2>

```c
stringstream ss(a);
```

<h2>"tu do hanh phuc" -> "ut od hnah cuhp"</h2>

```c
void daoChuoi()
{
	string a;
	getline(cin,a);
	stringstream ss(a);
	string tmp;
	while(ss >> tmp)
	{
		reverse(tmp.begin(),tmp.end());
		cout<<tmp<<" ";
	}

	// Luu chuoi
	string c;
	while(ss >> tmp)
		c+=tmp+" ";
}
```

<h2>Chuyển chuỗi ký tự thành số</h2>

```c
int changeToNum(string s)
{
	int value = 0;
	for (int i = 0; i < s.size(); i++)
		value = value * 10 + (s[i] - '0');
	return value;
}
```

<h2>Chuyển số thành chuỗi ký tự</h2>

```c
string changeToString(int value)
{
	string result = "";
	if (value == 0)
		return "0";

	while (value > 0)
	{
		result = (char)('0' + value % 10) + result;
		value /= 10;
	}
	return result;
}
```

<h1>Thao tác mảng</h1>

<h2>Mảng 2 chiều thành mảng 1 chiều</h2>

```c
void mang2thanh1chieu(int A[][SIZE], int m, int n, int B[])
{
	int nB=0;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			B[nB++]=A[i][j];
}
```

<h2>Mảng 1 chiều thành mảng 2 chiều</h2>

```c
void mang1thanh2chieu(int A[][SIZE], int m, int n, int B[])
{
	int nB=0;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			A[i][j]=B[nB++];
}
```

<h2>Chèn x vào k</h2>

```c
void chenXvaoK(int A[], int &n, int x, int k)
{
	for(int i=n-1;i>=k;i--)
		A[i+1]=A[i];
	A[k]=x;
	n++;
}
```

<h2>Xóa vị trí k</h2>

```c
void xoaViTriK(int A[], int &n, int k)
{
	for(int i=k;i<n-1;i++)
		A[i]=A[i+1];
	n--;
}
```

<h2>Ghép mảng xen kẽ</h2>

```c
void ghepMangXenKe(nt &nC, int C[])
{
	int iA=0;
	int iB=0;
	nC=0;
	while(iA<nA && iB<nB)
	{
		C[nC++]=A[iA++];
		C[nC++]=B[iB++];
	}
	while(iA<nA)
		C[nC++]=A[iA++];
	while(iB<nB)
		C[nC++]=B[iB++];
}
```

<h2>Tổng số trong chuỗi</h2>

```c
int tongSoTrongChuoi(char A[])
{
	int n=strlen(A);
	int s=0;
	int num=0;
	for(int i=0;i<=n;i++)
		if(A[i]>='0'&&A[i]<='9')
			num=num*10+(A[i]-'0');
		else
		{
			s+=num;
			num=0;
		}
	return s;
}
```

<h2>Lật ngược mảng</h2>

```c
void latNguoc(char A[], int x, int y)
{
	while(x<y)
	{
		char tmp=A[x];
		A[x]=A[y];
		A[y]=tmp;
		x++;
		y--;
	}
}
```

<h2>Đổi từ hệ 2 sang hệ 10</h2>

```c
int doiHe2SangHe10(char S[])
{
	int s=0;
	for (int i=0;i<strlen(S);i++)
		s+=pow(2,i)*(S[i]-'0');
	return s;
}
```

<h2>Đổi từ hệ 10 sang hệ 2, 8, 16</h2>

```c
void doiHe(int n, char S[], int he)
{
	char x[]={'0','1','2','3','4','5','6',
	'7','8','9','A','B','C','D', 'E','F'};
	int i=0;
	while(n>0)
	{
		S[i]=x[n%he];
		n /= he;
		i++;
	}
	S[i]='\0';
	strrev(S);
}
```

<h2>Ngày liền sau 1 ngày</h2>

```c
void ngayLienSau1ngay(int &d, int &m, int &y)
{
	d++;
	if(d>tinhNgayTrongThang(m,y))
	{
		d=1;
		m++;
		if(m>12)
		{
			m=1;
			y++;
		}
	}
}
```

<h2>Ngày thứ bao nhiêu trong năm</h2>

```c
int soNgayThuBaoNhieuTrongNam(int d, int m, int y)
{
	int dem=d;
	for(int i=1; i< m; i++)
		dem= dem + tinhNgayTrongThang(i,y);
	return dem;
}
```

<h2>Tính số ngày trong năm</h2>

```c
int soNgayTrongNam(int y)
{
	if(ktNamNhuan(y)==1)
		return 366;
	else
		return 365;
}
```

<h2>Ngày - Tháng - Năm HỢP LỆ</h2>

```c
bool hopLe(int d, int m, int y)
{
	return d>0 && d<=tinhNgayTrongThang(m,y) && m>0 && m<13 && y>0;
}
```

<h2>Kiểm tra NĂM NHUẬN</h2>

```c
bool ktNamNhuan(int y)
{
	return( y>0 && (y % 4 == 0 && y % 100 != 0 || y % 400 == 0) );
}
```

<h2>Tính số ngày trong tháng</h2>

```c
int tinhNgayTrongThang(int m, int y)
{
	if(m==4||m==6||m==9||m==11)
		return 30;
	else
		if(m==2)
		{
			if(ktNamNhuan(y))
				return 29;
			else
				return 28;
		}
		else
			return 31;
}
```

<h2>Tìm x (lính canh)</h2>

```c
int timX(int A[], int n, int x)
{
	A[n]=x;
	int i=0;
	while(A[i]!=x)
		i++;
	if(i<n)
		return 1;
	else
		return -1;
}
```

<h2>Tìm x nhị phân (mảng tăng dần)</h2>

```c
int timXnhiPhan(int A[], int n, int x)
{
	int r,l;
	r=n-1;
	l=0;

	for(int i=l;i<r;i++)
	{
		int mid= (l+r-1)/2;
		if(A[mid]==x)
			return mid;
		else
			if(A[mid]>x)
				r=mid-1;
			else
				l=mid+1;
	}
	return -1;
}
```

<h2>Tìm x nhị phân (đệ quy)</h2>

```c
int timX(int A[], int left, int right, int x)
{
	if(right>=left)
	{
		int mid=left+(right-left)/2;
		if(A[mid]==x)
			return mid;
		else
			if(A[mid]>x)
				return timX(A,left,mid-1,x);
			else
				return timX(A,mid+1,right,x);
	}
	return -1;
}
```

<h2>Tổ hợp (đệ quy)</h2>

```c
int toHop(int k, int n)
{
	if(k==0||k==n)
		return 1;
	if(k==1)
		return n;
	else
		return toHop(k-1,n-1)+toHop(k,n-1);
}
```

<h2>Tìm UCLN của 2 số</h2>

```c
int UCLN(int a, int b)
{
	a=abs(a);
	b=abs(b);
	while(a!=b)
	{
		if (a>b)
			a-= b;
		else
			b-= a;
	}
	return a;
}
```

<h2>Tìm BCNN của 2 số</h2>

```c
int BCNN(int a, int b)
{
	return a*b/UCLN(a,b);
}
```

<h2>Xuất ra số ĐẢO NGƯỢC của n</h2>

```c
int reverse(int n)
{
	int rev=0;
	for(int r; n>0; n=n/10)
	{
		r = n%10;
		rev = rev*10 +r;
	}
	return rev;
}
```

<h2>Kiểm tra n TĂNG DẦN</h2>

```c
int ktTangDan(int n)
{
	int cuoi=n%10;
	n /= 10;
	while(n!=0)
	{
		int keCuoi=n%10;
		n /=10;
		if(keCuoi<cuoi)
			cuoi=keCuoi;
		else
			return 0;
	}
	return 1;
}
```

<h2>Kiểm tra SỐ NGUYÊN TỐ</h2>

```c
bool ktSNT(int n)
{
	if(n<2)
		return 0;
	for(int i=2; i<=sqrt(n); i++)
		if(n%i == 0)
			return 0;
	return 1;
}
```

<h2>Kiểm tra SỐ HOÀN HẢO</h2>

```c
bool ktSHH(int n)
{
	int s=0;
	for(int i=1; i<= n/2; i++)
	{
		if (n%i == 0)
			s+= i;
	}
	if (s==n)
		return 1;
	else
		return 0;
}
```

<h2>Kiểm tra SỐ CHÍNH PHƯƠNG</h2>

```c
bool ktSCP(int n)
{
	int i=0;
	while(i*i <=n)
	{
		if(i*i==n)
			return 1;
		i++;
	}
	return 0;
}
```

<h2>Kiểm tra SỐ AMSTRONG</h2>

```c
bool laSoAmstrong(int n)
{
	int k=demChuSo(n);
	int s=0;
	int cpy=n;
	while(n>0)
	{
		int tmp=n%10;
		s+=tinhXmuP(tmp,k);
		n/=10;
	}
	if(s==cpy)
		return 1;
	else
		return 0;
}
```

<h2>Phân tích thừa số nguyên tố</h2>

```c
int phanTichThuaSoNguyenTo(int n)
{
	int dem;
	for(int i=2; i<=n; i++)
	{
		dem=0;
		while(n % i == 0)
		{
			dem++;
			n /= i;
		}
		if(dem!=0)
		{
			cout << i;
			if(dem > 1)
				cout <<"^"<< dem;
			if(n > i)
				cout <<" * ";
		}
	}
}
```

<h2>Dãy Fibonacci</h2>

```c
int dayFibonacci(int n)
{
	int f1=1;
	int fn=1;
	if (n==0 || n==1)
		return n;
	else
		for(int i=2; i<n; i++)
		{
			int f0=f1;
			f1=fn;
			fn=f0+f1;
		}
	return fn;
}
```

<h2>Fibonacci (đệ quy)</h2>

```c
int fibo(int n)
{
	if (n==0 || n==1)
		return 1;
	else
		return fibo(n-2)+fibo(n-1);
}
```

<h2>Fibonacii (số lớn)</h2>

```c
string fibo(int n)
{
	if(n==0)
		return "0";
	else
		if(n==1)
			return "1";

	string a="0";
	string b="1";
	string c="";
	for(int i=2;i<=n;i++)
	{
		c=tong2soLon(a,b);
		a=b;
		b=c;
	}
	return c;
}
```

<h2>Tìm min (đệ quy)</h2>

```c
int min(int A[], int n)
{
	if(n==0)
		return -1;
	if(n==1)
		return A[0];
	else
		if(A[n-1]<min(A,n-1))
			return A[n-1];
		else
			return min(A,n-1);
}
```

<h2>Tổng mảng 1 chiều (đệ quy)</h2>

```c
int tong(int A[], int n)
{
	if(n==0)
		return 0;
	else
		return A[n-1]+tong(A,n-1);
}
```

<h2>Giai thừa (đệ quy)</h2>

```c
int giaiThua(int n)
{
	if(n==0)
		return 1;
	else
		return n*giaiThua(n-1);
}
```

<h2>Tính x mũ p (đệ quy)</h2>

```c
int tinhXmuP(int x, int p)
{
	if(p==1)
		return x;
	else
		return x*tinhXmuP(x,p-1);
}
```

<h2>Tổng 2 số lớn</h2>

```c
string tong2soLon(string a, string b)
{
	while(a.size()<b.size())
		a="0"+a;
	while(b.size()<a.size())
		b="0"+b;
	reverse(a.begin(),a.end());
	reverse(b.begin(),b.end());

	int t=0;
	int nho=0;
	string s="";

	for(int i=0;i<a.size();i++)
	{
		t=(a[i]-'0') + (b[i]-'0') + nho;
		s+= t%10 + '0';
		nho= t/10;
	}

	if(nho==1)
		s+="1";
	reverse(s.begin(),s.end());
	return s;
}
```

<h2>Hiệu 2 số lớn</h2>

```c
string hieu2soLon(string a, string b)
{
	while(a.size()<b.size())
		a="0"+a;
	while(b.size()<a.size())
		b="0"+b;
	reverse(a.begin(),a.end());
	reverse(b.begin(),b.end());

	string c;
	int t=0;
	int nho=0;

	for(int i=0;i<a.size();i++)
	{
		t=(a[i]-'0') -(b[i]-'0') -nho;
		if(t<0)
		{
			c+=t+10 +'0';
			nho=1;
		}
		else
		{
			c+=t +'0';
			nho=0;
		}
	}

	reverse(c.begin(),c.end());
	if(c[0]=='0')
		return "0";
	else
		return c;
}
```

<h2>Tích 2 số lớn</h2>

```c
string tich2soLon(string a, string b)
{
	while(a.size()<b.size())
		a="0"+a;
	while(b.size()<a.size())
		b="0"+b;
	reverse(a.begin(),a.end());
	reverse(b.begin(),b.end());

	string c;
	for(int k=0;k<a.size()+b.size();k++)
		c+="0";

	for(int iB=0;iB<b.size();iB++)
	{
		int nho=0;
		int iA;
		for(iA=0;iA<a.size();iA++)
		{
			int x= (b[iB]-'0')*(a[iA]-'0') + nho + (c[iA+iB]-'0');
			c[iA+iB]= x%10 +'0';
			nho= x/10;
		}
		if(nho>0)
			c[iA+iB]=nho + '0';
	}
	reverse(c.begin(),c.end());
	while(c[0]=='0')
		c.erase(0,1);
	return c;
}
```

<h2>Số lớn chia số nhỏ</h2>

<h2> [num] là số cần chia, [numlen] là độ dài của số cần chia </h2>

```c
string divide (string a)
{
	if ((int)a.size() < <numlen> && changeToNum(a) < <num>)
		return "0";
	string ans = "";
	int res = 0;
	for (int i = 0; i < a.size(); i++) {
		int tmp = res * 10 + (a[i] - '0');
		ans += changeToString(tmp / <num>);
		res = tmp % <num>;
	}
	while (ans[0] == '0') ans.erase(0, 1);
	return ans;
}
```

<h2>So sánh 2 chuỗi</h2>

```c
int soSanh(string a, string b)
{
	if(a.size()>b.size())
		return 1;
	else
		if(a.size()<b.size())
			return -1;
		else
			if(a>b)
				return 1;
			else
			{
				if(a<b)
					return -1;
				else
					return 0;
			}
}
```

<h2>Đếm phần tử trùng</h2>

```c
void demTanSuatTungKyTu(char A[], int n)
{
	for(int i=0;i<n;i++)
	{
		bool kt=1;
		for(int j=i-1;j>=0;j--)
		{
			if(A[i]==A[j])
			{
				kt=0;
				break;
			}
		}
		if(kt==1)
		{
			int dem=0;
			for(int k=0;k<n;k++)
			{
				if(A[i]==A[k])
					dem++;
			}
			cout<<A[i]<<": "<<dem<<endl;
		}
	}
}
```

<h2>Liệt kê nhị phân (đệ quy)</h2>

```c
void lietKeNhiPhan(int k)
{
	if(k==n)
		xuat();
	else
	{
		for(int i=0;i<=1;i++)
		{
			A[k]=i;
			lietKeNhiPhan(k+1);
		}
	}
}
```

<h2>Sinh nhị phân</h2>

```c
void sinhNhiPhan(int n)
{
	int A[SIZE]={0};
	int i;
	do
	{
		i=n-1;
		xuat(A,n);
		while(i>=0 && A[i]==1)
		{
			A[i]=0;
			i--;
		}
		if(i>=0)
			A[i]=1;
	}
	while(i>=0);
}
```

<h2>Liệt kê tập con (đệ quy)</h2>

```c
void lietKeTapCon(int k)
{
	if(k==n)
		xuat();
	else
	{
		for(int i=0;i<=1;i++)
		{
			A[k]=i;
			lietKeTapCon(k+1);
		}
	}
}
```

<h2>Sinh tập con</h2>

```c
void sinhTapCon()
{
	int A[SIZE]={0};
	int k=0;
	int i=0;
	xuat(A,k);
	k=1;

	do
	{
		xuat(A,k);
		if(A[i]<n-1)
		{
			A[i+1]=A[i]+1;
			i++;
			k++;
		}
		else
		{
			if(i==0)
				break;
			i--;
			k--;
			A[i]++;
		}
	}
	while(true);
}
```

<h2>Liệt kê hoán vị (đệ quy)</h2>

```c
void lietKeHoanVi(int k)
{
	if(k==n)
		xuat();
	else
	{
		for(int i=0;i<n;i++)
		{
			if(B[i]==0)
			{
				A[k]=i;
				B[i]=1;
				lietKeHoanVi(k+1);
				B[i]=0;
			}
		}
	}
}
```

<h2>Sinh hoán vị</h2>

```c
void sinhHoanVi(int A[], int n)
{
	xuat(A,n);
	do
	{
		int k=n-2;
		while(k>=0 && A[k]>A[k+1])
			k--;
		if(k<0)
			break;
		int l=n-1;
		while(A[l]<A[k])
			l--;
		doiCho(A[k],A[l]);
		latNguoc(A,k+1,n-1);
		xuat(A,n);
	}
	while(true);
}
```

<h2>Người đi du lịch - Tính chi phí tối ưu</h2>

```c
void tinhChiPhi()
{
	int chiPhi=0;
	for(int i=0;i<n-1;i++)
		chiPhi+=C[A[i]][A[i+1]];
	chiPhi+=C[A[n-1]][A[0]];
	if(chiPhi<chiPhiToiUu)
	{
		chiPhiToiUu=chiPhi;
		for(int i=0;i<n;i++)
			H[i]=A[i];
	}
}
```

<h2>Phân công công việc - Thời gian tối ưu</h2>

```c
void tgTU()
{
	int ta=0;
	int tb=0;
	for(int i=0;i<n;i++)
		if(P[i]==0)
			ta+=A[i];
		else
			tb+=B[i];
	int tg=ta;
	if(ta<tb)
		tg=tb;
	if(tg<tgtu)
	{
		tgtu=tg;
		for(int i=0;i<n;i++)
			H[i]=P[i];
	}
}
```

<h2>Độ sâu dấu ngoặc "(,)"</h2>

```c
int tinhDoSau()
{
	int mongoac=0;
	int dosau=0;
	int i=0;
	while(i<m)
	{
		if(A[i]==0)
			mongoac++;
		else
		{
			if(mongoac==0)
				return -1;
			if(mongoac>dosau)
				dosau=mongoac;
			mongoac--;
		}
		i++;
	}
	if(mongoac==0)
		return dosau;
	else
		return -1;
}
```

<h2>Kiểm tra vị trí yên ngựa</h2>

```c
bool ktYenNgua(int A[][SIZE], int m, int n, int x, int y)
{
	int tam=A[x][y];

	//max hang
	for(int j=0;j<n;j++)
		if(tam<A[x][j])
			return 0;

	//min cot
	for(int i=0;i<m;i++)
		if(tam>A[i][y])
			return 0;

	return 1;
}
```

<h2>Tính F(n). Với F(0)=0, F(1)=1, F(2n)=F(n), F(2n+1) = F(n) + F(n+1)</h2>

<h2>Đệ quy</h2>

```c
int tinhFn(int n)
{
	if(n==0||n==1)
		return n;
	if(n%2==0)
		return tinhFn(n/2);
	else
		return tinhFn((n-1)/2) + tinhFn((n+1)/2);
}
```

<h2>Mảng F(n)</h2>

```c
int tinhFn(int A[], int n)
{
	A[0]="0";
	A[1]="1";
	for(int i=1;i<=n;i++)
	{
		A[2*i]=A[i];
		A[2*i+1]=A[i] + A[i+1];
	}
	return A[n];
}
```

<h2>Liệt kê mảng con tăng dần</h2>

<h2>6 5 3 2 3 4 2 7 -> [2 3 4; 2 7]</h2>

```c
void lietKeMangConTangDan(int A[], int n)
{
	int B[SIZE],nb=0;
	for(int i=0;i<n;i++)
	{
		B[nb++]=A[i];
		if(i==n-1 || A[i]>A[i+1])
		{
			if(nb>1)
				xuat(B,nb);
			nb=0;
		}
	}
}
```

<h2>Tam giác Pascal (đệ quy)</h2>

```c
int pascal(int k, int n)
{
	if(k==0||k==n)
		return 1;
	else
		return pascal(k-1,n-1) + pascal(k,n-1);
}
```

```c
void tamGiacPascal(int n)
{
	for(int i=0;i<=n;i++)
	{
		for(int k=0;k<=i;k++)
			cout<<setw(5)<<pascal(k,i);
		cout<<endl;
	}
}
```

<h2>Tìm dãy đơn điệu dài nhất</h2>

```c
int timMax(int A[], int a, int b)
{
	int max=A[a];
	for(int i=a;i<b;i++)
		if(A[i]>=max)
			max=A[i];
	return max;
}
```

<h2>Tìm xâu con chung dài nhất</h2>

```c
void xuLy(char A[], char B[], int nA, int nB, int L[][SIZE])
{
    char T[SIZE];
    int nt = 0;
    int i = nB;
    int j = nA;
    while (true)
    {
        if (A[j - 1] == B[i - 1])
        {
            T[nt] = A[j - 1];
            i--;
            j--;
            nt++;
        }
        else
        {
            if (timMax(L[i - 1][j], L[i][j - 1]) == L[i - 1][j])
                i--;
            else
                j--;
        }
        if (L[i][j] == 0)
            break;
    }
    T[nt] = '\0';
    strrev(T);
    puts(T);
}
```

<h2>Gán mảng</h2>

```c
void ganMang(int A[], int n, int L[])
{
	for(int i=0;i<=n+1;i++)
	{
		int max=timMax(L,i+1,n+1);
			for(int j=i+1;j<=n+1;j++)
			{
				if(L[j]==max && A[j]>=A[i])
				{
					cout<<A[j]<<" ";
					break;
				}
			}
	}
}
```

<h2>Quy hoạch động</h2>

```c
void quyHoachDong(int A[], int n, int L[])
{
	for(int i=n+1;i>=0;i--)
	{
		L[i]=1;
		for(int j=i+1;j<=n+1;j++)
		{
			if((i==0 || j==n+1 || A[i]<=A[j]) && L[i]<L[j]+1)
				L[i]=L[j]+1;
		}
	}
}
```

```c
void quyHoachDong(char A[], char B[], int nA, int nB, int L[][SIZE])
{
    for (int i = 0; i <= nB; i++)
        L[i][0] = 0;
    for (int i = 0; i <= nA; i++)
        L[0][i] = 0;
    for (int i = 0; i < nB; i++)
    {
        for (int j = 0; j < nA; j++)
        {
            if (A[j] == B[i])
                L[i + 1][j + 1] = L[i][j] + 1;
            else
                L[i + 1][j + 1] = timMax(L[i][j + 1], L[i + 1][j]);
        }
    }
}
```

<h1>Thao tác BIT</h1>

<h2>Khái niệm</h2>

<p>&1 = chính nó, &0 = 0</p>

<p>|0 = chính nó, |1 = 1</p>

<p>^: giống = 0, khác = 1</p>

<p>~: 0 = 1, 1 = 0;</p>

<h2>Ghi chú</h2>

<p>Dịch trái (n&lt;&lt;k = n*2^k) (đuôi thêm 0)</p>

<p>Dịch phải (n>>k = n/2^k) (đầu thêm bit trái cùng)</p>

<h2>Lấy bit</h2>

```c
int layBit(int n, int k)
{
    return (n >> k) & 0x1;
}
```

<h2>Bật bit</h2>

```c
void batBit(int &n, int k)
{
    n = n | (0x1 << k);
}
```

<h2>Tắt bit</h2>

```c
void tatBit(int &n, int k)
{
    n = n & (~(0x1 << k));
}
```

<h2>Dịch trái xoay vòng</h2>

```c
int dichTraiXoayVong(int n, int k)
{
    int a = 0x1;
    for (int i = 0; i < k; i++)
        batBit(a, i);
    return ((n >> 32 - k) & a) | (n << k);
}
```

<h2>Đếm bit 1</h2>

```c
int demBit1(int n, int dem, int he)
{
    for (int i = 0; i < he; i++)
    {
        if (layBit(n, i) == 1)
            dem++;
    }
    return dem;
}
```
