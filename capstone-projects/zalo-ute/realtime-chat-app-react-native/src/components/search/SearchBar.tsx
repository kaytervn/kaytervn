import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = ({ 
  value, 
  onChangeText, 
  onSubmitEditing, 
  onSearch, 
  placeholder, 
  handleClear,
  additionalIcon,
  onAdditionalIconPress
}: any) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#FFFFFF"
          style={styles.searchInput}
          onSubmitEditing={onSubmitEditing}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={onSearch} style={styles.searchButton}>
        <Ionicons name="search" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      {additionalIcon && (
        <TouchableOpacity onPress={onAdditionalIconPress} style={styles.additionalButton}>
          <Ionicons name={additionalIcon} size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#00A3FF",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  searchButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  additionalButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginStart: 5
  },
});

export default SearchBar;