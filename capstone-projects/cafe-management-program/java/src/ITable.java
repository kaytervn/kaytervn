import java.io.IOException;

public interface ITable {
    void ShowTableList() throws IOException;

    void SearchTableOption(String a) throws IOException;

    void OpenTable(Table tb, int pos) throws IOException;

    void SortTable() throws IOException;
}