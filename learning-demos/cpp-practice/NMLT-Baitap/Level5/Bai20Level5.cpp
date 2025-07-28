#include <iostream>
using namespace std;
void nhap(int &n);
int phanTichThuaSoNguyenTo(int n);
int main()
{
	int n;
	nhap(n);
	phanTichThuaSoNguyenTo(n);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
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
