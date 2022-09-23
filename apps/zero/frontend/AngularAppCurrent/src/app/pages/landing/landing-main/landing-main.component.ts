// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit, ViewChild } from '@angular/core';

// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';

// rxjs
import { from, Subject, timer } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

// misc
import { ENV } from '@environment/environment';

// wml components
import { WMLButton, WMLImage } from '@windmillcode/wml-components-base';

// near 
import * as nearAPI from "near-api-js";
const { connect, keyStores, WalletConnection } = nearAPI;

@Component({
  selector: 'landing-main',
  templateUrl: './landing-main.component.html',
  styleUrls: ['./landing-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class LandingMainComponent {

  constructor(
    private cdref: ChangeDetectorRef,
    private utilService: UtilityService,
    private configService: ConfigService,
    private baseService: BaseService
  ) { }
  classPrefix = this.utilService.generateClassPrefix('LandingMain')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub = new Subject<void>()

  createNearWalletLink = "https://wallet.near.org/create"
  walletConnection

  initNearWalletLogic = () => {
    let { keyStores } = nearAPI;
    let myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
    const { connect } = nearAPI;

    const connectionConfig = {
      networkId: "testnet",
      keyStore: myKeyStore, // first create a key store 
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    from(connect(connectionConfig))
      .pipe(
        takeUntil(this.ngUnsub),
        tap((nearConnection ) => {
          console.log(nearConnection )

          this.walletConnection = new WalletConnection(nearConnection,"1");
          this.connectWallet()
        })
      )
      .subscribe()
  }

  connectWallet = ()=>{
    this.walletConnection.requestSignIn(
      "aurora.fakes.testnet", // contract requesting access
      "Proof Of Vibes", // optional title
      "http://localhost:4200", // optional redirect URL on success
      "http://localhost:4200/failure" // optional redirect URL on failure
    );
  }

  signOut=()=>{
    this.walletConnection.signOut()
  }

  connectWalletBtn = new WMLButton({
    click:this.initNearWalletLogic,
    value:"landingMain.connectWalletBtn"
  })
  ngOnInit(): void {
    // this.initNearWalletLogic()
    
  }

  ngAfterViewInit() {

  }



  ngOnDestroy() {
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}


