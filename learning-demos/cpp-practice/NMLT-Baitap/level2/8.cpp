#include<iostream>
void nhap(int &a);
void xuat(int a);
using namespace std;
int main()
{
	int a;
	nhap(a);
	xuat(a);
	return 0;
}
void nhap(int &a)
{
	cout<<"Nhap so nguyen bat ki (0 den 9): "; cin>>a;
}
void xuat(int a)
{
	if (a==0) 
		cout<<"Khong";
	else 
		if (a==1) 
			cout<<"Mot";
		else 
			if (a==2) 
				cout<<"Hai";
			else 
				if (a==3) 
					cout<<"Ba";
				else 
					if (a==4) 
						cout<<"Bon";
					else 
						if (a==5) 
							cout<<"Nam";
						else 
							if (a==6) 
								cout<<"Sau";
							else 
								if (a==7) 
									cout<<"Bay";
								else 
									if (a==8) 
										cout<<"Tam";
									else 
										if (a==9) 
											cout<<"Chin";
										else 
											cout<<"Khong biet viet";
}
