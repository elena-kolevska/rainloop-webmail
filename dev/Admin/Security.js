/* RainLoop Webmail (c) RainLoop Team | Licensed under CC BY-NC-SA 3.0 */

/**
 * @constructor
 */
function AdminSecurity()
{
	this.csrfProtection = ko.observable(!!RL.settingsGet('UseTokenProtection'));

	this.adminLogin = ko.observable(RL.settingsGet('AdminLogin'));
	this.adminPassword = ko.observable('');
	this.adminPasswordNew = ko.observable('');

	this.adminPasswordUpdateError = ko.observable(false);
	this.adminPasswordUpdateSuccess = ko.observable(false);

	this.adminPassword.subscribe(function () {
		this.adminPasswordUpdateError(false);
		this.adminPasswordUpdateSuccess(false);
	}, this);

	this.adminPasswordNew.subscribe(function () {
		this.adminPasswordUpdateError(false);
		this.adminPasswordUpdateSuccess(false);
	}, this);
	
	this.saveNewAdminPasswordCommand = Utils.createCommand(this, function () {

		this.adminPasswordUpdateError(false);
		this.adminPasswordUpdateSuccess(false);

		RL.remote().saveNewAdminPassword(this.onNewAdminPasswordResponse, {
			'Password': this.adminPassword(),
			'NewPassword': this.adminPasswordNew()
		});

	}, function () {
		return '' !== this.adminPassword() && '' !== this.adminPasswordNew();
	});

	this.onNewAdminPasswordResponse = _.bind(this.onNewAdminPasswordResponse, this);
}

Utils.addSettingsViewModel(AdminSecurity, 'AdminSettingsSecurity', 'Security', 'security');

AdminSecurity.prototype.onNewAdminPasswordResponse = function (sResult, oData)
{
	if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
	{
		this.adminPassword('');
		this.adminPasswordNew('');

		this.adminPasswordUpdateSuccess(true);
	}
	else
	{
		this.adminPasswordUpdateError(true);
	}
};

AdminSecurity.prototype.onBuild = function ()
{
	this.csrfProtection.subscribe(function (bValue) {
		RL.remote().saveAdminConfig(Utils.emptyFunction, {
			'TokenProtection': bValue ? '1' : '0'
		});
	});
};

AdminSecurity.prototype.onHide = function ()
{
	this.adminPassword('');
	this.adminPasswordNew('');
};

/**
 * @return {string}
 */
AdminSecurity.prototype.phpInfoLink = function ()
{
	return RL.link().phpInfo();
};
