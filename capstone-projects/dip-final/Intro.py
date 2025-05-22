import streamlit as st


def run():
    st.set_page_config(page_title="DIP Final", page_icon="🍪")

    st.write("# DIP Final! 👋")

    st.sidebar.success("Select an option above.")

    st.markdown(
        """
        ### Group Member ☕​
        - 21110332 - Kiến Đức Trọng
        - 21110335 - Nguyễn Trần Văn Trung
    """
    )


if __name__ == "__main__":
    run()
