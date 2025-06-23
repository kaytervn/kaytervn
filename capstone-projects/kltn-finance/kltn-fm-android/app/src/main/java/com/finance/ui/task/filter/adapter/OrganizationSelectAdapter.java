package com.finance.ui.task.filter.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.data.SecretKey;
import com.finance.data.model.api.response.organization.OrganizationResponse;
import com.finance.databinding.ItemOrganizationSelectBinding;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
public class OrganizationSelectAdapter extends RecyclerView.Adapter<OrganizationSelectAdapter.OrganizationViewHolder> {

    private final List<OrganizationResponse> organizations;

    @Setter
    private Long isSelected;

    public OrganizationSelectAdapter(List<OrganizationResponse> organizations, OrganizationSelectListener organizationListener) {
        this.organizations = organizations;
        this.organizationSelectListener = organizationListener;
    }

    @Setter
    private OrganizationSelectListener organizationSelectListener;
    @Setter
    private boolean lock;

    public void updateItem(Integer position, OrganizationResponse OrganizationResponse) {
        organizations.set(position, OrganizationResponse);
        notifyItemChanged(position);
    }
    public interface OrganizationSelectListener {
        void itemClick(View view, int position);
    }
    @NonNull
    @Override
    public OrganizationViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemOrganizationSelectBinding binding = ItemOrganizationSelectBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new OrganizationViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull OrganizationViewHolder holder, int position) {
        holder.onBind(position);
        holder.binding.layoutMain.setOnClickListener(view -> organizationSelectListener.itemClick(view, position));
    }

    @Override
    public int getItemCount() {
        return organizations!= null? organizations.size() : 0;
    }

    public void addList(List<OrganizationResponse> organizations){
        if(organizations == null){
            return;
        }
        this.organizations.addAll(organizations);
        notifyItemRangeInserted(this.organizations.size() - organizations.size(),organizations.size());
    }

    public void deleteItem(int position){
        organizations.remove(position);
        notifyItemRemoved(position);
        notifyItemRangeChanged(position, organizations.size());
    }

    public class OrganizationViewHolder extends RecyclerView.ViewHolder{
        ItemOrganizationSelectBinding binding;
        int position;
        OrganizationResponse organizationResponse;
        public OrganizationViewHolder(ItemOrganizationSelectBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        void onBind(int position){
            this.position = position;
            organizationResponse = organizations.get(position);
            binding.setIvm(organizationResponse);
            binding.setIvmSelectedId(isSelected);
            binding.setSecretKey(SecretKey.getInstance().getKey());
            binding.executePendingBindings();
        }

    }
}
