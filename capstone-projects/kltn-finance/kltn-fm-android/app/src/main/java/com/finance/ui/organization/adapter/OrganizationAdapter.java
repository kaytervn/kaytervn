package com.finance.ui.organization.adapter;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.ui.swipe.ViewBinderHelper;
import com.finance.data.model.api.response.organization.OrganizationResponse;
import com.finance.databinding.ItemOrganizationBinding;
import com.finance.utils.AESUtils;
import com.finance.utils.BindingUtils;

import java.util.List;
import lombok.Getter;
import lombok.Setter;


public class OrganizationAdapter extends RecyclerView.Adapter<OrganizationAdapter.Organization> {
    @Getter
    @Setter
    private List<OrganizationResponse> organizationResponses;
    @Getter
    @Setter

    private ViewBinderHelper viewBinderHelper = new ViewBinderHelper();
    @Getter
    @Setter
    private String secretKey;
    private final OrganizationListener organizationListener;


    public OrganizationAdapter(List<OrganizationResponse> OrganizationResponses, OrganizationListener organizationListener) {
        this.organizationResponses = OrganizationResponses;
        this.organizationListener = organizationListener;
        viewBinderHelper.setOpenOnlyOne(true);
    }


   
    public interface OrganizationListener{
        void onItemClick(int position, View view);
        void onDeleteClick(int position, View view);
    }
    @NonNull
    @Override
    public Organization onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemOrganizationBinding binding = ItemOrganizationBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new Organization(binding,organizationListener);
    }

    @Override
    public void onBindViewHolder(@NonNull Organization holder, int position) {
        holder.onBind(position);
    }

    @Override
    public int getItemCount() {
        return organizationResponses!= null? organizationResponses.size() : 0;
    }

    @SuppressLint("NotifyDataSetChanged")
    public void addList(List<OrganizationResponse> items){
        if(items == null){
            return;
        }
        this.organizationResponses.addAll(items);
       notifyDataSetChanged();
    }

    public void deleteItem(int position){
        organizationResponses.remove(position);
        notifyItemRemoved(position);
        notifyItemRangeChanged(position, organizationResponses.size());
    }

    public class Organization extends RecyclerView.ViewHolder implements View.OnClickListener{
        ItemOrganizationBinding binding;
        OrganizationListener OrganizationListener;
        int position;
        OrganizationResponse organization;
        public Organization(ItemOrganizationBinding binding, OrganizationListener OrganizationListener) {
            super(binding.getRoot());
            this.binding = binding;
            binding.getRoot().setOnClickListener(this);
            this.OrganizationListener = OrganizationListener;
        }

        void onBind(int position){
            this.position = position;
            organization = organizationResponses.get(position);
            viewBinderHelper.bind(binding.swipeRevealLayout, String.valueOf(organization.getId()));
            binding.setIvm(organization);
            binding.setSecretKey(secretKey);
            BindingUtils.setImageUrl(binding.imgLogo, AESUtils.decrypt(secretKey,organization.getLogo(), false));
            binding.layoutDelete.setOnClickListener(view -> {
                OrganizationListener.onDeleteClick(position, view);
                viewBinderHelper.closeLayout(String.valueOf(organization.getId()));
            });
            binding.layoutMain.setOnClickListener(view -> {
                OrganizationListener.onItemClick(position,view);
                viewBinderHelper.closeLayout(String.valueOf(organization.getId()));
            });

            binding.executePendingBindings();
        }

        @Override
        public void onClick(View view) {
            OrganizationListener.onItemClick(position, view);
        }
    }
}
