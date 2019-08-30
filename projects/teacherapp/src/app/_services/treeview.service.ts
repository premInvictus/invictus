import { Injectable } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';

@Injectable()
export class TreeviewService {

	constructor() { }
	isExist(arrayhas, field, id) {
		if (arrayhas.length > 0) {
			if (arrayhas.find(item => item[field] === id)) {
				return true;
			}
		}
		return false;
	}

	getItemData(type, arrayhas, data) {
		const treeItems: any [] = [];
		switch (type) {
			case 'menu' :
				for (const moditem of data) {
					const mitem: any = {};
					mitem.text = moditem.mod_name;
					mitem.value = moditem.mod_id;
					mitem.checked = this.isExist(arrayhas, 'menu_mod_id', moditem.mod_id);
					mitem.children = [];
					for (const submenu1 of moditem.submenu_level_1) {
						const submenu1item: any = {};
						submenu1item.text = submenu1.mod_name;
						submenu1item.value = moditem.mod_id + '-' + submenu1.mod_id;
						submenu1item.checked = this.isExist(arrayhas, 'menu_mod_id', submenu1.mod_id);
						submenu1item.children = [];
						for (const submenu2 of submenu1.submenu_level_2) {
							const submenu2item: any = {};
							submenu2item.text = submenu2.mod_name;
							submenu2item.value = moditem.mod_id + '-' + submenu1.mod_id + '-' + submenu2.mod_id;
							submenu2item.checked = this.isExist(arrayhas, 'menu_mod_id', submenu2.mod_id);
							submenu1item.children.push(submenu2item);
						}
						mitem.children.push(submenu1item);
					}
					treeItems.push(new TreeviewItem(mitem));
				}
				break;
			case 'class' :
				for (const element of data) {
					const mitem: any = {};
					mitem.text = element.class_name;
					mitem.value = element.class_id;
					mitem.checked = this.isExist(arrayhas, 'class_id', element.class_id);
					treeItems.push(new TreeviewItem(mitem));
				}
				break;
			case 'subject' :
				for (const element of data) {
					const mitem: any = {};
					mitem.text = element.sub_name;
					mitem.value = element.sub_id;
					mitem.checked = this.isExist(arrayhas, 'uc_sub_id', element.sub_id);
					treeItems.push(new TreeviewItem(mitem));
				}
				break;
			case 'topic' :
				for (const element of data) {
					const mitem: any = {};
					mitem.text = element.topic_name;
					mitem.value = element.topic_id;
					mitem.checked = this.isExist(arrayhas, 'topic_id', element.topic_id);
					treeItems.push(new TreeviewItem(mitem));
				}
				break;
		}
		return treeItems;

	}

}
