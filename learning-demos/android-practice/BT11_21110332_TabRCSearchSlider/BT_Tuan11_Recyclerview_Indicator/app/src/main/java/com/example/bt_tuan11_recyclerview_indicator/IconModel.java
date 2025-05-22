package com.example.bt_tuan11_recyclerview_indicator;

import java.io.Serializable;

public class IconModel implements Serializable {
    public Integer getImgId() {
        return imgId;
    }

    public void setImgId(Integer imgId) {
        this.imgId = imgId;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    private Integer imgId;
    private String desc;
    public IconModel(Integer imgId, String desc){
        this.imgId = imgId;
        this.desc = desc;
    }

}
