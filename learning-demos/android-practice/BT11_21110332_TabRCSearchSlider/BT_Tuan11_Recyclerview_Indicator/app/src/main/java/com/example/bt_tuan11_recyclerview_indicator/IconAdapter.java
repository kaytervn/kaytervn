package com.example.bt_tuan11_recyclerview_indicator;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.security.PublicKey;
import java.util.List;

public class IconAdapter extends RecyclerView.Adapter<IconAdapter.IconHolder> {
    private Context context;
    private List<IconModel> arrayList;
    public IconAdapter(Context context, List<IconModel> arrayList){
        this.context = context;
        this.arrayList = arrayList;
    }

    @NonNull
    @Override
    public IconHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewTypre){
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_icon_promotion,parent, false);
        return new IconHolder(view);
    }

    @Override
    public void onBindViewHolder(IconHolder viewHolder, int position){
        IconModel iconModel = arrayList.get(position);
        Glide.with(context).load(iconModel.getImgId()).into(viewHolder.imageView);
        viewHolder.tvIcon.setText(iconModel.getDesc());
    }

    @Override
    public int getItemCount(){
        if (arrayList != null){
            return arrayList.size();
        }
        return 0;
    }
    public class IconHolder extends RecyclerView.ViewHolder{
        private ImageView imageView;
        private TextView tvIcon;
        public IconHolder(View itemView){
            super(itemView);
            imageView = itemView.findViewById(R.id.ivTmgIcon);
            tvIcon = itemView.findViewById(R.id.tvIcon);
        }
    }

    public void setListenerList(List<IconModel> iconModelList){
        this.arrayList = iconModelList;
        notifyDataSetChanged();
    }
}
