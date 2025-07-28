#include<iostream>

using namespace std;

unsigned int tinhTienThue(int n);
void nhap(int &n);
void xuat(unsigned int n);

int main()
{
	int x;
	nhap(x);
	unsigned int kq = tinhTienThue(x);
	xuat(kq);
	return 0;
}
unsigned int tinhTienThue(int n)
{
	long double tienThue;
	if (n <= 5000000)
		tienThue = n*(0.05);
	else
		if (n > 5000000 && n <= 10000000)
			tienThue = 5000000*(0.05) + (n-5000000)*(0.1);
		else
			if (n > 10000000 && n <= 18000000)
				tienThue = 5000000*(0.05) + 5000000*(0.1) + (n-10000000)*(0.15);
			else
				if (n > 18000000 && n <= 32000000)
					tienThue = 5000000*(0.05) + 5000000*(0.1) + 8000000*(0.15) + (n-18000000)*(0.2);
				else
					if (n > 32000000 && n <= 52000000)
						tienThue = 5000000*(0.05) + 5000000*(0.1) + 8000000*(0.15) + 14000000*(0.2) + (n-32000000)*(0.25);
					else
						if (n > 52000000 && n <= 80000000)
							tienThue = 5000000*(0.05) + 5000000*(0.1) + 8000000*(0.15) + 14000000*(0.2) + 20000000*(0.25) + (n-52000000)*(0.3);
						else
							tienThue = 5000000*(0.05) + 5000000*(0.1) + 8000000*(0.15) + 14000000*(0.2) + 20000000*(0.25) + 28000000*(0.3) + (n-80000000)*(0.35);
	tienThue*=12;
	unsigned int kq = (unsigned int)tienThue;
	if(kq != tienThue)
		kq += 1;
	return kq;
}
void nhap(int &n)
{
	cin >> n;
}
void xuat(unsigned int n)
{
	cout << n;
}
