/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import "react-medium-image-zoom/dist/styles.css";
import SearchBar from "./SearchBar";
import { EmptyState, LoadingState } from "./FetchingState";
import PostCard from "./PostCard";
import FileModal from "./FileModal";
import ApiKeyDialog from "./ApiKeyDialog";
import { useGlobalContext } from "../../../components/config/GlobalProvider";
import useApi from "../../../hooks/useApi";
import { DOC_TITLE, TOAST } from "../../../types/constant";
import useDocTitle from "../../../hooks/useDocTitle";

const LessonClient = () => {
  useDocTitle(DOC_TITLE.N_LESSONS);
  const { setToast } = useGlobalContext();
  const { lesson, loading } = useApi();
  const [posts, setPosts] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [isApiDialogOpen, setIsApiDialogOpen] = useState(false);

  const fetchData = async () => {
    const res = await lesson.list();
    if (res.result) {
      setPosts(res.data?.content || []);
    } else {
      setToast(res.message, TOAST.ERROR);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const uniqueCategories = useMemo(() => {
    const categories = posts
      .map((post: any) => post.category?.name)
      .filter(Boolean);
    return ["all", ...new Set(categories)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post: any) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || post.category?.name === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  const openModal = (file: any) => {
    setCurrentFile(file);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentFile(null);
  };

  const openApiDialog = () => {
    setIsApiDialogOpen(true);
  };

  const closeApiDialog = () => {
    setIsApiDialogOpen(false);
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen text-gray-100">
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 shadow-lg">
        <div className="container mx-auto p-4">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={uniqueCategories}
            refreshData={fetchData}
            openApiDialog={openApiDialog}
          />
        </div>
      </div>

      <div className="container mx-auto p-4">
        {loading ? (
          <LoadingState />
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post: any) => (
            <PostCard key={post._id} post={post} openModal={openModal} />
          ))
        ) : (
          <EmptyState searchTerm={searchTerm} />
        )}
      </div>

      {isModalOpen && currentFile && (
        <FileModal file={currentFile} onClose={closeModal} />
      )}

      <ApiKeyDialog isOpen={isApiDialogOpen} onClose={closeApiDialog} />
    </div>
  );
};

export default LessonClient;
